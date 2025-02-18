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
      // Separate vendor dependencies into a 'vendor' chunk
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    },
    chunkSizeWarningLimit: 600, // Adjust this limit as needed
  },
  plugins: [
    dynamicImportVars(), // Enables dynamic import vars for chunking optimization
  ],
  watch: {
    include: 'src/**', // Include your source files for watching changes
  },
};
