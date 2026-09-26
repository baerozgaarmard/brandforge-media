// music + frame-accurate SFX -> mix.wav (30.000 s, 48 kHz stereo, -14 LUFS)
const { execFileSync } = require('child_process')
const F = '../node_modules/ffmpeg-static/ffmpeg.exe'
const TRACK = 14.05 // Cold Veil's drop (32.05 s) lands on the film's 0:18 pulse
const sfx = [ // file, at (s), gain, trim length, extra filter
  ['hum', 0.8, 0.22, 3.4, 'lowpass=f=1800,afade=t=in:d=1.2,afade=t=out:st=2.4:d=1'],      // heat line
  ['metal-groan', 3.85, 0.45, 2.6, 'afade=t=out:st=1.8:d=0.8'],                          // stress before the split
  ['sub-drop', 4.0, 0.22, 2.6, 'afade=t=out:st=1.4:d=1.2'],                                                          // the split
  ['metal-slide', 4.35, 0.3, 1.6, 'afade=t=out:st=1.2:d=0.4'],                            // layers slide apart
  ['metal-slide', 5.05, 0.2, 1.4, 'afade=t=out:st=1:d=0.4'],
  ...[0, 1, 2, 3, 4, 5].map((i) => ['click', 6.7 + i * 0.075, 0.16, 0.4, '']),            // grid snap, column by column
  ['clamp', 7.22, 0.4, 1.2, 'afade=t=out:st=0.8:d=0.4'],                                  // the press
  ['swoosh-slow', 7.95, 0.22, 2.5, ''],                                                    // rise to top-down
  ...[0, 1, 2, 3].map((i) => ['click', 8.3 + i * 0.12, 0.07, 0.4, 'highpass=f=1500']),     // page etching ticks
  ['swoosh-slow', 12.0, 0.3, 2.5, ''],                                                     // sweep into the architecture
  ['glass', 12.6, 0.12, 3.2, 'lowpass=f=5000,afade=t=in:d=0.6,afade=t=out:st=2.2:d=1'],   // glass resonance
  ['glass-tap', 14.15, 0.3, 1.2, ''], ['glass-tap', 14.42, 0.22, 1.2, ''],                 // cards lift
  ['servo', 16.05, 0.28, 1.1, 'afade=t=out:st=0.8:d=0.3'],                                 // board assembles
  ...[16.75, 17.05, 17.35].map((t) => ['click', t + 0.4, 0.28, 0.4, '']),                  // gate decisions
  ...[16.75, 17.05, 17.35].map((t) => ['glass-tap', t + 0.88, 0.18, 1, '']),               // service cards light
  ['low-hit', 18.0, 0.75, 2.4, ''],                                                        // every route fires
  ['swoosh-slow', 19.65, 0.3, 2.5, ''],                                                    // convergence
  ['servo', 20.15, 0.22, 0.9, 'afade=t=out:st=0.6:d=0.3'], ['clamp', 21.0, 0.3, 1.2, ''],  // frame locks
  ['glass', 21.4, 0.1, 2.8, 'lowpass=f=4500,afade=t=in:d=0.5,afade=t=out:st=1.8:d=1'],
  ['servo', 24.0, 0.18, 0.8, 'afade=t=out:st=0.5:d=0.3'],                                 // hinges
  ...[0, 1, 2].map((i) => ['swoosh-thin', 24.05 + i * 0.22, 0.2, 1.5, '']),                // pages fan out
  ['boom', 27.6, 0.85, 2.4, 'afade=t=out:st=1.2:d=1.2'],                                   // wordmark: one low impact
  ['sub-drop', 27.6, 0.4, 2.4, 'afade=t=out:st=1.4:d=1'],
]
const inputs = ['-i', 'music/m1-cold-veil.mp3', '-i', 'music/m1-cold-veil.mp3', ...sfx.flatMap(([f]) => ['-i', `sfx/${f}.mp3`])]
const parts = [
  // muffled, near-silent opening that opens up into the full track, which drops out at 0:27
  `[0:a]atrim=${TRACK}:${TRACK + 30},asetpts=N/SR/TB,aresample=48000,lowpass=f=700,volume=0.9,afade=t=in:st=0.2:d=3.8:curve=exp,afade=t=out:st=6.5:d=3.5[mlp]`,
  `[1:a]atrim=${TRACK}:${TRACK + 30},asetpts=N/SR/TB,aresample=48000,afade=t=in:st=6:d=4.5:curve=qsin,afade=t=out:st=26.75:d=0.4[mfull]`,
  ...sfx.map(([f, at, g, len, fx], i) => `[${i + 2}:a]atrim=0:${len},asetpts=N/SR/TB,aresample=48000,aformat=channel_layouts=stereo${fx ? ',' + fx : ''},volume=${g},adelay=${Math.round(at * 1000)}:all=1[s${i}]`),
  `[mlp][mfull]${sfx.map((_, i) => `[s${i}]`).join('')}amix=inputs=${sfx.length + 2}:normalize=0:duration=longest,atrim=0:30,afade=t=out:st=29.2:d=0.8,highpass=f=25,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000[out]`,
]
execFileSync(F, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', parts.join(';'), '-map', '[out]', '-ac', '2', '-ar', '48000', 'mix.wav'], { stdio: 'inherit' })
console.log('mix.wav done')
