import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import path from 'path';

export default {
  input: 'script.js', // Replace with your actual entry file
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: '[name]-[hash].js',
    entryFileNames: '[name].js',
    manualChunks(id) {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    },
  },
  plugins: [
    dynamicImportVars(), // Enables dynamic import vars for chunking optimization
  ],
  watch: {
    include: 'src/**', // Include your source files for watching changes
  },
  external: ['three', 'three/examples/jsm/controls/OrbitControls.js', 'three/addons/loaders/GLTFLoader.js'], // Mark these dependencies as external
};
