// Soundtrack for the brand film, synthesised offline so it lines up with the picture to the sample.
// Warm and soft on purpose: sine/triangle voices, everything lowpassed, no bright hats or saw buzz.
// 120 bpm grid (hits land on the picture cuts), A minor. Returns a 16-bit stereo WAV as base64.
export async function score() {
  const SR = 48000, LEN = 30, B = 0.5, BAR = 2
  const ac = new OfflineAudioContext(2, SR * LEN, SR)

  // master: soft top end, gentle glue
  const master = ac.createGain(); master.gain.value = 0.8
  const tone = ac.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 6500; tone.Q.value = 0.5
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25
  master.connect(tone).connect(comp).connect(ac.destination)

  // warm hall reverb (dark impulse)
  const rev = ac.createConvolver()
  const ir = ac.createBuffer(2, SR * 4, SR)
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += ((Math.random() * 2 - 1) - lp) * 0.18; d[i] = lp * Math.pow(1 - i / d.length, 2.6) * 3 } }
  rev.buffer = ir
  const revIn = ac.createGain(); revIn.gain.value = 0.5
  revIn.connect(rev).connect(master)

  const noiseBuf = ac.createBuffer(1, SR * 2, SR)
  { const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 }
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(t); s.stop(t + dur); return s }
  const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d) }
  const out = (node, wet = 0, pan = 0) => {
    const p = ac.createStereoPanner(); p.pan.value = pan; node.connect(p); p.connect(master)
    if (wet) { const w = ac.createGain(); w.gain.value = wet; p.connect(w).connect(revIn) }
  }
  const hz = (m) => 440 * 2 ** ((m - 69) / 12)
  const osc = (type, f, t, dur) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.start(t); o.stop(t + dur); return o }

  // ---- voices ----
  const kick = (t, v = 1) => { // round, no click
    const o = osc('sine', 110, t, 0.6), g = ac.createGain()
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.14)
    env(g, t, 0.006, 0.85 * v, 0.45); o.connect(g); out(g)
  }
  const knock = (t, v = 0.18, pan = 0) => { // soft woodblock instead of hats/claps
    const o = osc('sine', 620, t, 0.12), g = ac.createGain(); o.frequency.exponentialRampToValueAtTime(420, t + 0.08)
    env(g, t, 0.003, v, 0.07); o.connect(g); out(g, 0.35, pan)
  }
  const brush = (t, v = 0.05) => { // very soft, dark shaker
    const s = noise(t, 0.2), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 0.7
    env(g, t, 0.01, v, 0.08); s.connect(f).connect(g); out(g, 0.2, 0.3)
  }
  const boom = (t, big = 1) => { // cinematic hit: sub drop + dark air
    const o = osc('sine', 70, t, 3), g = ac.createGain(); o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(32, t + 1.5)
    env(g, t, 0.01, 0.9 * big, 2 * big); o.connect(g); out(g, 0.35)
    const s = noise(t, 2), f = ac.createBiquadFilter(), ng = ac.createGain(); f.type = 'lowpass'; f.frequency.setValueAtTime(1400, t); f.frequency.exponentialRampToValueAtTime(120, t + 1)
    env(ng, t, 0.01, 0.35 * big, 1.2 * big); s.connect(f).connect(ng); out(ng, 1)
  }
  const swell = (t, dur = 0.6, v = 0.22) => { // soft air sweep into a cut
    const s = noise(t - dur, dur + 0.15), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'lowpass'; f.Q.value = 2
    f.frequency.setValueAtTime(200, t - dur); f.frequency.exponentialRampToValueAtTime(1800, t)
    g.gain.setValueAtTime(0.0001, t - dur); g.gain.exponentialRampToValueAtTime(v, t - 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    s.connect(f).connect(g); out(g, 0.5)
  }
  const rise = (t0, t1, v = 0.22) => {
    swell(t1, t1 - t0, v)
    const o = osc('triangle', hz(45), t0, t1 - t0), g = ac.createGain(); o.frequency.exponentialRampToValueAtTime(hz(57), t1)
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v * 0.5, t1 - 0.05); g.gain.linearRampToValueAtTime(0, t1)
    o.connect(g); out(g, 0.4)
  }
  const pad = (t, dur, notes, v = 0.05) => { // warm triangle choir
    const f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'lowpass'; f.frequency.value = 1100; f.Q.value = 0.3
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.6); g.gain.setValueAtTime(v, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.6)
    notes.forEach((n, i) => { for (const d of [-5, 5]) { const o = osc('triangle', hz(n), t, dur + 0.7); o.detune.value = d; o.connect(f) } })
    f.connect(g); out(g, 0.6)
  }
  const bass = (t, n, dur = 0.35, v = 0.4) => {
    const o = osc('sine', hz(n), t, dur + 0.1), o2 = osc('triangle', hz(n), t, dur + 0.1), g = ac.createGain(), f = ac.createBiquadFilter()
    f.type = 'lowpass'; f.frequency.value = 380
    env(g, t, 0.01, v, dur); o.connect(g); o2.connect(f).connect(g); out(g)
  }
  const keys = (t, n, v = 0.1, pan = 0) => { // mellow electric piano: low-index FM, fast decay of the overtone
    const o = osc('sine', hz(n), t, 2.2), m = osc('sine', hz(n) * 2, t, 2.2), mg = ac.createGain(), g = ac.createGain()
    mg.gain.setValueAtTime(hz(n) * 0.6, t); mg.gain.exponentialRampToValueAtTime(1, t + 0.8)
    m.connect(mg).connect(o.frequency); env(g, t, 0.004, v, 1.9); o.connect(g); out(g, 0.55, pan)
  }

  // ---- arrangement ----
  const chords = [[57, 60, 64], [53, 57, 60], [48, 55, 60], [55, 59, 62]] // Am F C G
  const roots = [45, 41, 48, 43]
  const motif = [76, 72, 74, 71] // top line, one per bar

  // 0-4 cold open: low hum, gentle heartbeat, swell into the reveal
  { const o = osc('sine', hz(33), 0, 4.5), o2 = osc('triangle', hz(45), 0, 4.5), g = ac.createGain()
    g.gain.setValueAtTime(0.0001, 0); g.gain.exponentialRampToValueAtTime(0.3, 2.5); g.gain.exponentialRampToValueAtTime(0.0001, 4.4); o.connect(g); o2.connect(g); out(g, 0.3) }
  for (const t of [1, 2, 3]) kick(t, 0.35), kick(t + 0.22, 0.2)
  pad(0.2, 3.6, [57, 64], 0.03)
  rise(2, 4, 0.2)

  // hits on the picture cuts
  boom(4, 1.1); boom(24, 0.9); boom(28, 1.2)
  for (const h of [8, 11, 14, 17, 20]) { swell(h, 0.5, 0.16); boom(h, 0.35) }

  // 4-8 reveal: piano statement, then the words
  keys(4, 69, 0.14); keys(4, 76, 0.07, 0.2); keys(4.02, 64, 0.08, -0.2)
  pad(4, 2, chords[0], 0.04)
  for (let t = 6; t < 8; t += B) { kick(t, 0.9); bass(t, 45, 0.3, 0.35) }

  // 8-24 groove: kick on 1 and 3, knocks on the off-beats, round bass, pad + motif
  for (let t = 8; t < 24; t += B) {
    const bar = Math.floor((t - 8) / BAR) % 4, beat = Math.round((t - 8) / B) % 4
    if (beat === 0 || beat === 2) kick(t, beat === 0 ? 0.95 : 0.8)
    if (t >= 11 && (beat === 1 || beat === 3)) knock(t, 0.12, beat === 1 ? -0.25 : 0.25)
    if (t >= 14) brush(t + B / 2, 0.035)
    bass(t, roots[bar], 0.4, 0.3)
    if (beat === 0) { pad(t, BAR, chords[bar], 0.04); keys(t + (t >= 11 ? 0.75 : 0), motif[bar], 0.08, 0.15) }
  }
  rise(22.5, 24, 0.18)

  // 24-30 finale: open, slower, resolve on A
  pad(24, 4, [57, 60, 64, 71], 0.045)
  for (const [t, n] of [[24.5, 76], [25.5, 72], [26.5, 74], [27.3, 71]]) keys(t, n, 0.09, (t % 2) - 0.5)
  for (const t of [24, 25, 26, 27]) kick(t, 0.7), bass(t, t < 26 ? 45 : 41, 0.7, 0.26)
  pad(28, 2, [45, 57, 64, 69], 0.05); keys(28, 69, 0.12); keys(28.02, 76, 0.06); bass(28, 33, 1.8, 0.35)

  const buf = await ac.startRendering()
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
