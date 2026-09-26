import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { projects, cover } from './projects.js'

gsap.registerPlugin(ScrollTrigger)
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = matchMedia('(max-width: 800px)').matches
const $ = (s) => document.querySelector(s)
const $$ = (s) => [...document.querySelectorAll(s)]

// projects render first so the cursor/reveal code below picks them up
const url = (p) => `/work/${p.slug}.html`
const grid = $('.work__grid')
if (grid) grid.innerHTML = projects.map((p) => `
  <a class="card" href="${url(p)}" data-cursor="View">
    <div class="card__media">${cover(p)}</div>
    <p class="card__meta"><strong>${p.name.join(' ')}</strong><span class="mono">${p.tags}</span></p>
  </a>`).join('')
const rows = $('.rows')
if (rows) rows.innerHTML = projects.map((p, i) => `
  <li><a class="row grid" href="${url(p)}" data-slug="${p.slug}"><span class="mono">0${i + 1}</span><strong>${p.name.join(' ')}</strong><span class="mono">${p.tags}</span><span class="mono">Concept</span></a></li>`).join('')
const casePage = $('.case-page') // static pages from scripts/pages.mjs; JS only adds the live cover
if (casePage) $('[data-slot="cover"]').innerHTML = cover(projects.find((p) => p.slug === casePage.dataset.slug))

// smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
let lenis
if (!calm) {
  lenis = new Lenis({ lerp: 0.09, anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

// cursor: dot that grows on links and shows a label on [data-cursor]
const cursor = $('.cursor')
const setX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
const setY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })
addEventListener('pointermove', (e) => { setX(e.clientX); setY(e.clientY) })
$$('a').forEach((a) => {
  a.addEventListener('pointerenter', () => {
    cursor.textContent = a.dataset.cursor || ''
    cursor.classList.add(a.dataset.cursor ? 'is-label' : 'is-hover')
  })
  a.addEventListener('pointerleave', () => cursor.classList.remove('is-hover', 'is-label'))
})

// headings: lines slide up when they enter
$$('.lines').forEach((el) => gsap.from(el.querySelectorAll('.line > span'), {
  yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08,
  scrollTrigger: { trigger: el, start: 'top 88%' },
}))

// paragraphs: words light up as they scroll through
$$('.reveal').forEach((el) => {
  el.innerHTML = el.innerHTML.replace(/(<em>.*?<\/em>|\S+)/g, '<span class="w">$1</span>')
  gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.15 }, {
    opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: true },
  })
})

// work index: the project's cover follows the cursor over its row
const preview = $('.preview')
if (preview) {
  const px = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' })
  const py = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' })
  addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY) })
  $$('.row').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      preview.innerHTML = cover(projects.find((p) => p.slug === row.dataset.slug))
      preview.classList.add('is-on')
    })
    row.addEventListener('pointerleave', () => preview.classList.remove('is-on'))
  })
}

// home only: preloader + the forge
const canvas = $('.gl')
if (canvas) home(canvas)

async function home(canvas) {
  const { createForge } = await import('./forge.js')
  const forge = createForge(canvas)

  // one keyframe per section; objects dissolve into each other as you scroll
  const only = (k) => ({ blob: 0, watch: 0, lamp: 0, chair: 0, videocam: 0, ring: 0, [k]: 1 })
  const phone = { // top-half placement; 0 scale where the section is text- or form-heavy
    '.hero': { x: 0, y: 0.85, scale: 0.72 }, '.intro': { x: 0, y: 1.2, scale: 0 },
    '#work': { x: 0, y: 1.2, scale: 0 }, '#contact': { x: 0, y: 1.2, scale: 0 }, '.footer': { x: 0, y: 1.2, scale: 0 },
  }
  const keys = [
    ['.hero',        { x: 1.3,  y: 0.2,  scale: 1.2,  amp: 0.2,  heat: 1,   ...only('blob') }],
    ['.intro',       { x: -2.3, y: -1.1, scale: 0.7,  amp: 0.26, heat: 1.1, ...only('blob') }],
    ['#automations', { x: 1.5,  y: 0,    scale: 1.05, amp: 0.2,  heat: 1,   ...only('watch') }],
    ['#web',         { x: 1.5,  y: -0.1, scale: 1.1,  amp: 0.2,  heat: 1,   ...only('lamp') }],
    ['#shopify',     { x: 1.5,  y: 0,    scale: 1.2,  amp: 0.2,  heat: 1,   ...only('chair') }],
    ['#social',      { x: 1.5,  y: 0,    scale: 1.1,  amp: 0.2,  heat: 1,   ...only('videocam') }],
    ['#work',        { x: 0,    y: -2.8, scale: 0.5,  amp: 0.2,  heat: 0.8, ...only('blob') }],
    ['#contact',     { x: 3.0,  y: 0.75, scale: 0.5,  amp: 0.12, heat: 0.6, ...only('ring') }],
    ['.footer',      { x: 3.0,  y: 1.6,  scale: 0.5,  amp: 0.12, heat: 0.6, ...only('') }], // ring fades before the footer covers it
  ].map(([sel, k]) => [sel, mobile ? { ...k, ...(phone[sel] ?? { x: 0, y: 1.0, scale: 0.62 }) } : k])

  // one source of truth: the furthest section that has started decides the target, so reloads
  // mid-page and fast scrolling can never leave the forge in a stale or half-blended shape
  Object.assign(forge.state, keys[0][1])
  const segments = keys.slice(1).map(([sel]) => ScrollTrigger.create({ trigger: sel, start: 'top 75%', end: 'top 30%' }))
  const inOut = gsap.parseEase('power2.inOut')
  gsap.ticker.add(() => {
    const i = segments.findLastIndex((s) => s.progress > 0)
    const [a, b, t] = i < 0 ? [keys[0][1], keys[0][1], 0] : [keys[i][1], keys[i + 1][1], inOut(segments[i].progress)]
    for (const k in a) forge.state[k] += (a[k] + (b[k] - a[k]) * t - forge.state[k]) * 0.12
  })

  // preloader once per visit; later page loads skip straight in
  const seen = (() => { try { return sessionStorage.bf || !(sessionStorage.bf = 1) } catch { return false } })()
  const count = $('.loader__count')
  const progress = { v: 0 }
  gsap.set('.hero__title .line > span', { yPercent: 110 })
  gsap.set(['.hero__index', '.hero__aside', '.hero__scroll', '.header'], { autoAlpha: 0 })

  const tl = gsap.timeline({ paused: true })
    .to(progress, {
      v: 100, duration: seen || calm ? 0.01 : 1.6, ease: 'power2.inOut',
      onUpdate: () => { count.textContent = String(Math.round(progress.v)).padStart(3, '0') },
    })
    .to('.loader', { yPercent: -100, duration: seen ? 0.6 : 1.1, ease: 'expo.inOut' })
    .add(() => document.body.classList.remove('is-loading'), '<')
    .to(forge.intro, { value: 1, duration: 1.8, ease: 'expo.out' }, '<0.3')
    .to('.hero__title .line > span', { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }, '<0.1')
    .to(['.header', '.hero__index', '.hero__aside', '.hero__scroll'], { autoAlpha: 1, duration: 0.8, stagger: 0.06 }, '<0.4')
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(() => tl.play()) // never wait forever on fonts
}

// header hides while scrolling down (so it never sits on top of content), returns on scroll up
let lastY = scrollY
addEventListener('scroll', () => {
  $('.header').classList.toggle('is-hidden', scrollY > lastY + 2 && scrollY > 120) // +2 ignores iOS bounce jitter
  $('.header').classList.toggle('is-solid', scrollY > 40)
  lastY = scrollY
}, { passive: true })

// on the home page, /#section links scroll smoothly instead of reloading
$$('a[href^="/#"]').forEach((a) => a.addEventListener('click', (e) => {
  const target = $(a.getAttribute('href').slice(1))
  if (!target || location.pathname !== '/') return
  e.preventDefault()
  lenis ? lenis.scrollTo(target, { duration: 1.4 }) : target.scrollIntoView({ behavior: 'smooth' })
}))

// enquiry form: posts to FormSubmit (emails the studio inbox), shows the result inline
const form = $('.enquiry')
form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const status = form.querySelector('.enquiry__status'), button = form.querySelector('button')
  const data = Object.fromEntries(new FormData(form))
  data.services = new FormData(form).getAll('services').join(', ') || 'Not specified'
  data._subject = `New enquiry from ${data.name}`
  button.disabled = true
  status.textContent = 'Sending…'
  try {
    const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) throw new Error(res.status)
    form.reset()
    status.textContent = "Thanks. We'll reply within 24 hours."
  } catch {
    status.textContent = "That didn't send. Email us at brandforgemediaa@gmail.com instead."
  } finally {
    button.disabled = false
  }
})
