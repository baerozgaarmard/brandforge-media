// out/master-picture.mov + audio/mix.wav -> all deliverables in DEST (blueprint §15)
const { execFileSync } = require('child_process')
const fs = require('fs')
const F = 'node_modules/ffmpeg-static/ffmpeg.exe'
const DEST = 'C:/Users/Ayush/Desktop/BrandForge Film'
fs.mkdirSync(DEST, { recursive: true })
const run = (args) => execFileSync(F, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' })
const pic = 'out/master-picture.mov', mix = 'audio/mix.wav'
const [, which = 'all'] = process.argv.slice(1)

// 1. 4K master: HEVC 10-bit 4:2:2 picture (already rendered) + 320k AAC
if (which === 'all' || which === 'master') run(['-i', pic, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', `${DEST}/BrandForge-Film-4K-Master.mov`])
// 2. 1080p web versions (grain kept; 10-bit AV1 to protect dark gradients)
const scale = 'scale=1920:1080:flags=lanczos'
if (which === 'all' || which === 'web') {
  run(['-i', pic, '-i', mix, '-map', '0:v', '-map', '1:a', '-vf', scale, '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', `${DEST}/brandforge-film-1080p.mp4`])
  run(['-i', pic, '-i', mix, '-map', '0:v', '-map', '1:a', '-vf', scale, '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '160k', '-shortest', `${DEST}/brandforge-film-1080p.webm`])
  run(['-i', pic, '-i', mix, '-map', '0:v', '-map', '1:a', '-vf', scale, '-c:v', 'libaom-av1', '-crf', '30', '-b:v', '0', '-cpu-used', '5', '-row-mt', '1', '-pix_fmt', 'yuv420p10le', '-c:a', 'libopus', '-b:a', '160k', '-shortest', `${DEST}/brandforge-film-1080p-av1.webm`])
}
// 3. poster frames (the monolith at 0:21.5, and the wordmark end frame)
if (which === 'all' || which === 'poster') {
  run(['-ss', '21.5', '-i', pic, '-frames:v', '1', '-vf', scale, '-q:v', '2', `${DEST}/poster-1920.jpg`])
  run(['-ss', '28.9', '-i', pic, '-frames:v', '1', '-vf', scale, '-q:v', '2', `${DEST}/poster-endframe-1920.jpg`])
}
for (const f of fs.readdirSync(DEST)) console.log(f.padEnd(40), (fs.statSync(`${DEST}/${f}`).size / 1e6).toFixed(1), 'MB')
