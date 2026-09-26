// Soundtrack for the brand film, synthesised offline so it lines up with the picture to the sample.
// 120 bpm, A minor. Returns a 16-bit stereo WAV as base64.
export async function score() {
  const SR = 48000, LEN = 30, B = 0.5, BAR = 2
  const ac = new OfflineAudioContext(2, SR * LEN, SR)

  // master: glue compressor -> gentle limiter feel
  const master = ac.createGain(); master.gain.value = 0.8
  const comp = ac.createDynamicsCompressor()
  Object.assign(comp, {}); comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.2
  master.connect(comp).connect(ac.destination)

  // shared reverb (generated impulse)
  const rev = ac.createConvolver()
  const ir = ac.createBuffer(2, SR * 3.5, SR)
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3.2) }
  rev.buffer = ir
  const revIn = ac.createGain(); revIn.gain.value = 0.35
  revIn.connect(rev).connect(master)

  const noiseBuf = ac.createBuffer(1, SR * 2, SR)
  { const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 }
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(t); s.stop(t + dur); return s }
  const env = (g, t, a, peak, d, end = 0.0001) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(end, t + a + d) }
  const out = (node, wet = 0) => { node.connect(master); if (wet) { const w = ac.createGain(); w.gain.value = wet; node.connect(w).connect(revIn) } }
  const hz = (m) => 440 * 2 ** ((m - 69) / 12)

  // ---- drums ----
  const kick = (t, v = 1) => {
    const o = ac.createOscillator(), g = ac.createGain()
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
    env(g, t, 0.002, 0.9 * v, 0.42); o.connect(g); out(g); o.start(t); o.stop(t + 0.5)
    const c = noise(t, 0.02), f = ac.createBiquadFilter(), cg = ac.createGain(); f.type = 'highpass'; f.frequency.value = 2500
    env(cg, t, 0.001, 0.25 * v, 0.015); c.connect(f).connect(cg); out(cg)
  }
  const hat = (t, v = 0.12, open = false) => {
    const s = noise(t, 0.3), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'highpass'; f.frequency.value = 8000
    env(g, t, 0.001, v, open ? 0.18 : 0.04); s.connect(f).connect(g); out(g, 0.1)
  }
  const clap = (t, v = 0.45) => {
    for (const o of [0, 0.011, 0.022]) {
      const s = noise(t + o, 0.25), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 0.8
      env(g, t + o, 0.001, v, o === 0.022 ? 0.16 : 0.01); s.connect(f).connect(g); out(g, 0.35)
    }
  }
  // ---- impacts, whooshes, risers ----
  const impact = (t, big = 1) => {
    const o = ac.createOscillator(), g = ac.createGain()
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(30, t + 1.2)
    env(g, t, 0.003, 1.0 * big, 1.6 * big); o.connect(g); out(g, 0.4); o.start(t); o.stop(t + 2.5)
    const s = noise(t, 1.5), f = ac.createBiquadFilter(), ng = ac.createGain(); f.type = 'lowpass'; f.frequency.setValueAtTime(6000, t); f.frequency.exponentialRampToValueAtTime(200, t + 0.8)
    env(ng, t, 0.002, 0.5 * big, 0.9 * big); s.connect(f).connect(ng); out(ng, 0.9)
  }
  const whoosh = (t, dur = 0.55, v = 0.35) => {
    const s = noise(t - dur, dur + 0.1), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.Q.value = 1.4
    f.frequency.setValueAtTime(300, t - dur); f.frequency.exponentialRampToValueAtTime(5000, t)
    g.gain.setValueAtTime(0.0001, t - dur); g.gain.exponentialRampToValueAtTime(v, t - 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)
    const pan = ac.createStereoPanner(); pan.pan.setValueAtTime(-0.7, t - dur); pan.pan.linearRampToValueAtTime(0.7, t)
    s.connect(f).connect(g).connect(pan); out(pan, 0.3)
  }
  const riser = (t0, t1, v = 0.3) => {
    const s = noise(t0, t1 - t0), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.Q.value = 3
    f.frequency.setValueAtTime(200, t0); f.frequency.exponentialRampToValueAtTime(7000, t1)
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t1 - 0.02); g.gain.linearRampToValueAtTime(0, t1)
    s.connect(f).connect(g); out(g, 0.4)
    const o = ac.createOscillator(), og = ac.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(hz(45), t0); o.frequency.exponentialRampToValueAtTime(hz(69), t1)
    const of = ac.createBiquadFilter(); of.type = 'lowpass'; of.frequency.value = 1200
    og.gain.setValueAtTime(0.0001, t0); og.gain.exponentialRampToValueAtTime(v * 0.25, t1 - 0.02); og.gain.linearRampToValueAtTime(0, t1)
    o.connect(of).connect(og); out(og, 0.3); o.start(t0); o.stop(t1)
  }
  const tick = (t, v = 0.2) => { // clockwork tick for the cold open
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = 3200
    env(g, t, 0.0005, v, 0.02); const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000
    o.connect(f).connect(g); out(g, 0.5); o.start(t); o.stop(t + 0.05)
  }
  // ---- tonal ----
  const chords = [[57, 60, 64], [53, 57, 60], [48, 55, 60, 64], [55, 59, 62]] // Am F C G
  const roots = [45, 41, 48, 43]
  const pad = (t, dur, notes, v = 0.05) => {
    const g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(700, t); f.frequency.linearRampToValueAtTime(1800, t + dur); f.Q.value = 0.5
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.4); g.gain.setValueAtTime(v, t + dur - 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.2)
    for (const n of notes) for (const d of [-7, 7]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(n); o.detune.value = d; o.connect(f); o.start(t); o.stop(t + dur + 0.3) }
    f.connect(g); out(g, 0.5)
  }
  const bass = (t, n, dur = 0.22, v = 0.35) => {
    const o = ac.createOscillator(), s = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter()
    o.type = 'sawtooth'; o.frequency.value = hz(n); s.type = 'sine'; s.frequency.value = hz(n - 12)
    f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(160, t + dur)
    env(g, t, 0.004, v, dur); o.connect(f); s.connect(f); f.connect(g); out(g); o.start(t); s.start(t); o.stop(t + dur + 0.05); s.stop(t + dur + 0.05)
  }
  const bell = (t, n, v = 0.12) => {
    const o = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain()
    o.frequency.value = hz(n); m.frequency.value = hz(n) * 3.5; mg.gain.value = hz(n) * 1.5
    m.connect(mg).connect(o.frequency); env(g, t, 0.002, v, 1.4); o.connect(g); out(g, 0.6); o.start(t); m.start(t); o.stop(t + 1.6); m.stop(t + 1.6)
  }

  // ================= arrangement =================
  // 0-4 cold open: drone, clock ticks, riser into the impact
  { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = hz(33); g.gain.setValueAtTime(0.0001, 0); g.gain.exponentialRampToValueAtTime(0.35, 2); g.gain.exponentialRampToValueAtTime(0.0001, 4.2); o.connect(g); out(g, 0.3); o.start(0); o.stop(4.3) }
  for (let t = 0.5; t < 3.9; t += B) tick(t, 0.05 + t * 0.03)
  riser(1.2, 4, 0.35)
  pad(0.2, 3.8, [57, 64], 0.025)
  // hits
  impact(4, 1.2); impact(24, 1); impact(28, 1.4)
  for (const h of [8, 11, 14, 17, 20]) { whoosh(h, 0.5, 0.3); impact(h, 0.45) }
  // 4-8: wordmark bell, kinetic words punch on each beat
  bell(4, 69, 0.14); bell(4.02, 76, 0.07)
  for (let t = 6; t < 8; t += B) { kick(t, 1); bass(t, 45, 0.3, 0.4) }
  riser(6.5, 8, 0.2)
  // 8-24: groove
  for (let t = 8; t < 24; t += B) {
    const bar = Math.floor((t - 8) / BAR) % 4, beat = Math.round((t - 8) / B) % 4
    kick(t, beat === 0 ? 1 : 0.85)
    hat(t + B / 2, 0.1, beat === 3)
    if (t >= 14) hat(t + B / 4, 0.05), hat(t + 3 * B / 4, 0.05)
    if (t >= 11 && (beat === 1 || beat === 3)) clap(t, 0.35)
    bass(t + B / 2, roots[bar], 0.2, 0.3); if (beat % 2 === 0) bass(t, roots[bar], 0.18, 0.25)
    if (beat === 0) pad(t, BAR, chords[bar], 0.04)
  }
  riser(22, 24, 0.3)
  for (let t = 20; t < 24; t += B / 2) hat(t, 0.07) // montage: 16ths
  // 24-30 finale: half-time, open pad, bell motif, big last hit
  for (const [t, n] of [[24.5, 76], [25.5, 72], [26.5, 74], [27.5, 71]]) bell(t, n, 0.09)
  pad(24, 4, [57, 60, 64, 71], 0.045); kick(24, 1); kick(25, 0.8); kick(26, 1); kick(27, 0.8)
  for (let t = 24; t < 28; t += B) bass(t, t < 26 ? 45 : 41, 0.4, 0.22)
  pad(28, 2, [57, 64, 69, 72], 0.05); bass(28, 33, 1.8, 0.35); bell(28, 81, 0.1)

  const buf = await ac.startRendering()
  // fade the very end + encode WAV
  const L = buf.getChannelData(0), R = buf.getChannelData(1), n = buf.length
  const data = new DataView(new ArrayBuffer(44 + n * 4))
  const str = (o, s) => [...s].forEach((c, i) => data.setUint8(o + i, c.charCodeAt(0)))
  str(0, 'RIFF'); data.setUint32(4, 36 + n * 4, true); str(8, 'WAVEfmt '); data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, 2, true)
  data.setUint32(24, SR, true); data.setUint32(28, SR * 4, true); data.setUint16(32, 4, true); data.setUint16(34, 16, true); str(36, 'data'); data.setUint32(40, n * 4, true)
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
  const norm = 0.89 / (peak || 1)
  for (let i = 0; i < n; i++) {
    const fade = Math.min(1, (n - i) / (SR * 1.2))
    data.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i] * norm * fade)) * 32767, true)
    data.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i] * norm * fade)) * 32767, true)
  }
  let bin = ''; const u8 = new Uint8Array(data.buffer)
  for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode(...u8.subarray(i, i + 0x8000))
  return btoa(bin)
}
