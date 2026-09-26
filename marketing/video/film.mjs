// Renders film.html to BrandForge-30s.mp4. Needs the Vite dev server on :5173 and `npm i playwright-core ffmpeg-static`.
// node film.mjs            -> full film (60fps render, frame-blended to 30fps for motion blur, music muxed in)
// node film.mjs 2 5 9 22   -> review stills at those seconds
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'

const DIR = 'C:/Users/Ayush/Desktop/BrandForge Media/marketing/video'
const stills = process.argv.slice(2).map(Number)
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('pageerror:', e.message))
await page.goto('http://localhost:5173/marketing/video/film.html')
await page.waitForFunction(() => window.ready, null, { timeout: 60000 })
await page.evaluate(() => window.ready)
for (const t of [0.5, 4.5, 6.5, 9, 12, 15, 18, 25]) await page.evaluate((t) => render(t), t) // compile every shader up front
await page.waitForTimeout(800)

if (stills.length) {
  for (const t of stills) { await page.evaluate((t) => render(t), t); await page.waitForTimeout(50); await page.screenshot({ path: `f-${t}.jpg`, quality: 85 }) }
} else {
  const FPS = 60, N = 30 * FPS
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', FPS, '-c:v', 'mjpeg', '-i', '-',
    '-ss', '8.655', '-t', '30', '-i', `${DIR}/track.mp3`,
    '-filter_complex', '[0:v]tmix=frames=2,fps=30,format=yuv420p[v];[1:a]afade=t=in:d=0.25,afade=t=out:st=28.2:d=1.8,loudnorm=I=-14:TP=-1:LRA=11[a]',
    '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000',
    '-shortest', '-movflags', '+faststart', `${DIR}/BrandForge-30s.mp4`], { stdio: ['pipe', 'ignore', 'pipe'] })
  ff.stderr.on('data', (d) => /error/i.test(d) && process.stdout.write(d))
  for (let f = 0; f < N; f++) {
    await page.evaluate((t) => render(t), f / FPS)
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 })
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
    if (f % 300 === 0) console.log(`frame ${f}/${N}`)
  }
  ff.stdin.end()
  await new Promise((r) => ff.on('close', r))
}
await browser.close()
