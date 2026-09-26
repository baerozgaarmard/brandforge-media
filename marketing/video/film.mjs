// node film.mjs            -> BrandForge-film.mp4 (needs the Vite dev server on :5173)
// node film.mjs 2 5 9 22   -> review stills
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const stills = process.argv.slice(2).map(Number)
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu'],
})
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
page.on('console', (m) => m.type() === 'error' && console.log('page:', m.text()))
page.on('pageerror', (e) => console.log('pageerror:', e.message))
await page.goto('http://localhost:5173/marketing/video/film.html')
await page.waitForFunction(() => window.ready, null, { timeout: 60000 })
await page.evaluate(() => window.ready)
for (const t of [0.5, 5, 9, 12, 15, 18, 25]) await page.evaluate((t) => render(t), t) // compile every shader before timing matters
await page.waitForTimeout(800)

if (stills.length) {
  for (const t of stills) { await page.evaluate((t) => render(t), t); await page.waitForTimeout(50); await page.screenshot({ path: `f-${t}.jpg`, quality: 85 }) }
} else {
  fs.writeFileSync('score.wav', Buffer.from(await page.evaluate(() => audio()), 'base64'))
  const FPS = 30, N = 30 * FPS
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', FPS, '-c:v', 'mjpeg', '-i', '-', '-i', 'score.wav',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', 'BrandForge-film.mp4'],
    { stdio: ['pipe', 'ignore', 'inherit'] })
  for (let f = 0; f < N; f++) {
    await page.evaluate((t) => render(t), f / FPS)
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 })
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
    if (f % 150 === 0) console.log(`frame ${f}/${N}`)
  }
  ff.stdin.end()
  await new Promise((r) => ff.on('close', r))
}
await browser.close()
