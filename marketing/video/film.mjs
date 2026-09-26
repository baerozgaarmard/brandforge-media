// Renders film.html (needs the Vite dev server on :5173, plus `npm i playwright-core ffmpeg-static` next to this script).
// node film.mjs 1 5.5 9          -> review stills (1080p) at those seconds
// node film.mjs full             -> 4K 24 fps picture master: out/master-picture.mov (H.265 10-bit 4:2:2, no audio)
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const full = process.argv[2] === 'full'
const stills = full ? [] : process.argv.slice(2).map(Number)
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 }) // 3840x2160
page.on('pageerror', (e) => console.log('pageerror:', e.message))
page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()))
await page.goto('http://localhost:5173/marketing/video/film.html')
await page.waitForFunction(() => window.ready, null, { timeout: 90000 })
await page.evaluate(() => window.ready)
for (const t of [1, 5, 7, 10, 14, 17, 18.5, 22, 25.5, 28.5]) await page.evaluate((t) => render(t, 1), t) // compile every shader first
await page.waitForTimeout(500)
fs.mkdirSync('out', { recursive: true })

if (!full) {
  for (const t of stills) {
    await page.evaluate((t) => render(t), t)
    await page.screenshot({ path: `out/still-${t}.jpg`, quality: 88, scale: 'css' })
  }
} else {
  const FPS = 24, N = 30 * FPS
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', FPS, '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx265', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv422p10le', '-tag:v', 'hvc1', 'out/master-picture.mov'],
    { stdio: ['pipe', 'ignore', 'pipe'] })
  ff.stderr.on('data', (d) => /error/i.test(d) && process.stdout.write(d))
  const t0 = Date.now()
  for (let f = 0; f < N; f++) {
    await page.evaluate((t) => render(t), f / FPS)
    const buf = await page.screenshot({ type: 'jpeg', quality: 96 })
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
    if (f % 48 === 0) console.log(`frame ${f}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)}s`)
  }
  ff.stdin.end()
  await new Promise((r) => ff.on('close', r))
}
await browser.close()
