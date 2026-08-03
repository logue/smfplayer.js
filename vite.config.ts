import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

import banner from 'vite-plugin-banner';
import { checker } from 'vite-plugin-checker';

import pkg from './package.json';

// Export vite config
export default defineConfig(async ({ mode }) => {
  const buildDate = new Date().toISOString();

  const config = {
    // https://vitejs.dev/config/shared-options.html#base
    base: './',
    publicDir: mode === 'docs' ? 'public' : false,
    // https://vitejs.dev/config/shared-options.html#define
    define: {
      'process.env': {},
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    plugins: [
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        vueTsc: false,
      }),
      // vite-plugin-banner
      // https://github.com/chengpeiquan/vite-plugin-banner
      // @ts-ignore
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
    resolve: {
      // https://vitejs.dev/config/shared-options.html#resolve-alias
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
      },
    },
    build: {
      // https://vitejs.dev/config/build-options.html#build-target
      target: 'esnext',
      outDir: mode === 'docs' ? 'docs' : 'dist',
      minify: true,
      // https://vitejs.dev/config/build-options.html#build-lib
      lib:
        mode === 'docs'
          ? undefined
          : {
              entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
              name: 'SMF',
              formats: ['es', 'umd', 'iife'],
              fileName: format => `smfplayer.${format}.js`,
            },
      sourcemap: true,
    },
  };

  return config;
});
