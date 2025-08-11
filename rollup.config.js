const { terser } = require('rollup-plugin-terser');
const fs = require('fs');
const path = require('path');

// Get all JS files from dist folder
const distPath = './dist';

function getJsFiles() {
  try {
    return fs.readdirSync(distPath)
      .filter(file => file.endsWith('.js') && !file.includes('bundle'))
      .map(file => path.join(distPath, file));
  } catch (error) {
    console.error('Error reading dist directory:', error);
    return ['./dist/main.js']; // fallback
  }
}

export default {
  input: getJsFiles(),
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'DirectDepositWebComponent',
    sourcemap: false,
    globals: {},
    // Ensure all code is bundled
    inlineDynamicImports: true
  },
  plugins: [
    terser({
      compress: {
        drop_console: false, // Keep console for debugging in production
        drop_debugger: true,
        pure_funcs: ['console.debug']
      },
      mangle: {
        // Don't mangle custom element names
        reserved: ['DirectDepositComponent', 'directDepositElement']
      }
    })
  ],
  external: [],
  onwarn: function(warning, warn) {
    // Suppress circular dependency warnings from Angular
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    // Suppress this-is-undefined warnings from Angular
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  }
}; 