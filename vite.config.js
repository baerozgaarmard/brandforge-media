export default {
  build: {
    chunkSizeWarningLimit: 700, // the three.js chunk; lazy-loaded on the home page only
    rollupOptions: { input: ['index.html', 'work.html', 'project.html'] },
  },
}
