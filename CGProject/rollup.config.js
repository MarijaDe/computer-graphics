export default {
    input: 'script.js',
    output: {
      dir: 'dist',
      format: 'esm',
      chunkFileNames: '[name]-[hash].js',
      entryFileNames: '[name].js',
      manualChunks(id) {
        // Split out `three.js` and other external dependencies into separate chunks
        if (id.includes('node_modules/three')) {
          return 'three';
        }
        // Further chunking logic can be added for other large modules
      },
      chunkSizeWarningLimit: 800, // This increases the size limit for the warning to 600kB
    },
    plugins: [dynamicImportVars()],
  };
  