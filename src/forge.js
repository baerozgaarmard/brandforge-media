import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

// Ashima 3D simplex noise
const noise = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+2.0*C.xxx;vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

export function createForge(canvas) {
  const mobile = matchMedia('(max-width: 800px)').matches
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2))
  renderer.setClearColor(new THREE.Color(0x0e0d0c).convertSRGBToLinear()) // composer pipeline encodes twice; this lands on the CSS --ink
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  camera.position.z = 7

  // studio: black room with softbox strips -> long, crisp chrome reflections
  const studio = new THREE.Scene()
  const softbox = (w, h, pos, color, power) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }))
    m.position.set(...pos)
    m.lookAt(0, 0, 0)
    studio.add(m)
  }
  // cyclorama: dim gradient dome so every tilted face reflects *something* (warm floor, grey horizon, lighter top)
  const dome = new THREE.SphereGeometry(20, 32, 16)
  const pos = dome.attributes.position, col = []
  const floor = new THREE.Color(0x3a1407), horizon = new THREE.Color(0x0c0b0a), top = new THREE.Color(0xb5b0a8)
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 20
    const c = y < 0 ? floor.clone().lerp(horizon, (y + 1) ** 3) : horizon.clone().lerp(top, y ** 1.5)
    col.push(c.r, c.g, c.b)
  }
  dome.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  studio.add(new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })))
  softbox(10, 2.5, [0, 7, 1], 0xffffff, 0.9)   // overhead softbox
  softbox(3, 12, [-7, 0, 3], 0xfff1e6, 0.45)   // left key
  softbox(1, 12, [7, 1, -1], 0xff5a1f, 1.3)    // warm forge rim
  softbox(12, 3, [0, -7, 3], 0x5a2410, 0.5)    // floor bounce
  softbox(2, 10, [6, 0, 7], 0xfff1e6, 0.5)     // front-right strip, catches faces turned toward the text
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(studio, 0).texture


  // ---------- dissolve: every object melts in/out with a hot forge-orange edge ----------
  function dissolvable(material, reveal, patch) {
    material.customProgramCacheKey = () => (patch ? 'dissolve-blob' : 'dissolve') // else the blob's program gets reused for everything
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uReveal = reveal
      patch?.(shader)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vDis;')
        .replace('#include <project_vertex>', 'vDis = transformed;\n#include <project_vertex>')
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\nuniform float uReveal; varying vec3 vDis; float dn;\n${noise}`)
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
          dn = snoise(vDis * 2.4) * 0.5 + 0.5;
          if (uReveal < 0.999 && dn > uReveal) discard;`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(1.0, 0.32, 0.05) * 7.0 * smoothstep(uReveal - 0.06, uReveal, dn) * step(uReveal, 0.999);`)
    }
    return material
  }
  const reveal = { blob: { value: 1 }, board: { value: 0 }, camera: { value: 0 }, shoe: { value: 0 }, megaphone: { value: 0 } }

  const rig = new THREE.Group()
  scene.add(rig)

  // ---------- molten blob (hero) ----------
  const heat = new THREE.Color(0xff2a12).multiplyScalar(2.6)
  const uniforms = { uTime: { value: 0 }, uAmp: { value: 0.22 }, uHeat: { value: heat.clone() } }
  const blob = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, mobile ? 64 : 128),
    dissolvable(new THREE.MeshPhysicalMaterial({ color: 0x8f8984, metalness: 1, roughness: 0.12 }), reveal.blob, (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
          uniform float uTime; uniform float uAmp; varying float vHeat; varying float vY;
          ${noise}
          float field(vec3 p){ return snoise(p*0.85 + uTime*0.12) + 0.15*snoise(p*1.9 - uTime*0.2); }
          vec3 displace(vec3 p){ vec3 n = normalize(p); return n + n*field(n)*uAmp; }`)
        .replace('#include <beginnormal_vertex>', `
          vec3 sn = normalize(position);
          vec3 tg = normalize(cross(sn, abs(sn.y) < 0.99 ? vec3(0,1,0) : vec3(1,0,0)));
          vec3 bt = cross(sn, tg);
          vec3 d0 = displace(sn);
          vec3 objectNormal = normalize(cross(displace(sn + tg*0.005) - d0, displace(sn + bt*0.005) - d0));
          if (dot(objectNormal, sn) < 0.0) objectNormal = -objectNormal;
          vHeat = field(sn);
          vY = d0.y;`)
        .replace('#include <begin_vertex>', 'vec3 transformed = d0;')
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uHeat; varying float vHeat; varying float vY;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          float glow = 1.0 - smoothstep(-1.15, -0.1, vY + vHeat*0.2); // heat rises from the base
          totalEmissiveRadiance += uHeat * glow * glow * glow;`)
    }),
  )
  rig.add(blob)

  // ---------- product models (CC0 Poly Haven + CC-BY Shopify shoe), melted in per service ----------
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const products = {}
  const pose = { // per-model hero angle
    board: [1.05, 0, -0.35], camera: [0.15, -0.65, 0], shoe: [0.2, -0.55, 0.05], megaphone: [0.1, 2.3, -0.25],
  }
  for (const name of Object.keys(pose)) {
    const holder = new THREE.Group()
    holder.visible = false
    holder.rotation.set(...pose[name])
    rig.add(holder)
    products[name] = holder
    loader.load(`/models/${name}.glb`, ({ scene: model }) => {
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3()).length()
      model.position.sub(box.getCenter(new THREE.Vector3()))
      const fit = new THREE.Group()
      fit.scale.setScalar(2.6 / size) // every product fills the same space
      fit.add(model)
      model.traverse((o) => {
        if (!o.isMesh) return
        o.material = dissolvable(o.material.clone(), reveal[name])
        o.material.envMapIntensity = 2.6 // the studio is tuned dark for chrome; textured products need more light
      })
      holder.add(fit)
    })
  }

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), mobile ? 0.3 : 0.4, 0.5, 0.9))
  composer.addPass(new OutputPass())

  // pointer: rotation target + "agitation" from pointer speed
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, energy: 0 }
  addEventListener('pointermove', (e) => {
    const x = e.clientX / innerWidth * 2 - 1
    const y = -(e.clientY / innerHeight * 2 - 1)
    pointer.energy = Math.min(pointer.energy + Math.hypot(x - pointer.tx, y - pointer.ty) * 2, 1)
    pointer.tx = x
    pointer.ty = y
  })

  // driven by scroll from main.js; blob/board/camera/shoe/megaphone are 0..1 visibility
  const state = { x: 0, y: 0, scale: 1, amp: 0.22, heat: 1, blob: 1, board: 0, camera: 0, shoe: 0, megaphone: 0 }
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false)
    composer.setSize(innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
  }
  resize()
  addEventListener('resize', resize)

  const clock = new THREE.Clock()
  const intro = { value: 0 }
  const objects = { blob, ...products }
  function tick() {
    const t = clock.getElapsedTime()
    pointer.x += (pointer.tx - pointer.x) * 0.05
    pointer.y += (pointer.ty - pointer.y) * 0.05
    pointer.energy *= 0.96

    uniforms.uTime.value = calm ? 0 : t
    uniforms.uAmp.value = state.amp + pointer.energy * 0.15
    uniforms.uHeat.value.copy(heat).multiplyScalar(state.heat)
    for (const k in objects) {
      reveal[k].value = state[k]
      objects[k].visible = state[k] > 0.01
    }

    rig.position.set(state.x + pointer.x * 0.12, state.y + pointer.y * 0.08, 0)
    rig.scale.setScalar(state.scale * intro.value)
    rig.rotation.set(-pointer.y * 0.25, pointer.x * 0.4, 0)

    blob.rotation.set(0.15, t * 0.1, 0)
    for (const k in products) products[k].rotation.y = pose[k][1] + Math.sin(t * 0.4) * 0.35 // slow turntable sway

    composer.render()
    requestAnimationFrame(tick)
  }
  tick()

  return { intro, state }
}
