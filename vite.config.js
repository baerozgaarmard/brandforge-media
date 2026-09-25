import fs from 'node:fs'

// every generated page (work/, services/, journal/) is its own entry
const pages = ['index.html', 'work.html', ...['work', 'services', 'journal'].flatMap((d) =>
  fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.html')).map((f) => `${d}/${f}`) : [])]

export default {
  build: {
    chunkSizeWarningLimit: 700, // the three.js chunk; lazy-loaded on the home page only
    rollupOptions: { input: pages },
  },
}
