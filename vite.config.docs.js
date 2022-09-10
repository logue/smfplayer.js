import { checker } from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import path from 'path';
import banner from 'vite-plugin-banner';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';
const pkg = require('./package.json');

// Export vite config
export default defineConfig(async ({ mode }) => {
  /** @type {UserConfig} https://vitejs.dev/config/ */
  const config = {
    // https://vitejs.dev/config/#base
    base: './',
    // Resolver
    resolve: {
      // https://vitejs.dev/config/shared-options.html#resolve-alias
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        '~bootstrap-icons': path.resolve(
          __dirname,
          'node_modules/bootstrap-icons'
        ),
        '~dseg': path.resolve(__dirname, 'node_modules/dseg'),
        // AWS Fix
        './runtimeConfig': './runtimeConfig.browser',
      },
    },
    // https://vitejs.dev/config/#server-options
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
    },
    plugins: [
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: false,
        vueTsc: false,
        eslint: {
          lintCommand: `eslint`, // for example, lint .ts & .tsx
        },
      }),
      // vite-plugin-banner
      // https://github.com/chengpeiquan/vite-plugin-banner
      banner(`/**
  * ${pkg.name}
  *
  * @description ${pkg.description}
  * @author iyama, Logue
  * @license ${pkg.license}
  * @version ${pkg.version}
  * @see {@link ${pkg.homepage}}
  */
  `),
    ],
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis', // <-- AWS SDK
        },
      },
    },
    // Build Options
    // https://vitejs.dev/config/#build-options
    build: {
      outDir: 'docs',
      // Minify option
      // https://vitejs.dev/config/#build-minify
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          wml: path.resolve(__dirname, 'wml.html'),
        },
        plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          rollupNodePolyFill(),
          inject({ Buffer: ['Buffer', 'Buffer'] }),
        ],
      },
      minify: 'esbuild',
    },
    esbuild: {
      drop: mode === 'serve' ? [] : ['console'],
    },
  };
  return config;
});
