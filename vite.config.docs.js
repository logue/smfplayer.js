import { checker } from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

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
        '~bootstrap': fileURLToPath(
          new URL('./node_modules/bootstrap', import.meta.url)
        ),
        '~bootstrap-icons': fileURLToPath(
          new URL('./node_modules/bootstrap-icons', import.meta.url)
        ),
        '~dseg': fileURLToPath(new URL('./node_modules/dseg', import.meta.url)),
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
    ],
    // Build Options
    // https://vitejs.dev/config/#build-options
    build: {
      outDir: 'docs',
      // Minify option
      // https://vitejs.dev/config/#build-minify
      rollupOptions: {
        input: {
          index: fileURLToPath(new URL('./index.html', import.meta.url)),
          wml: fileURLToPath(new URL('./wml.html', import.meta.url)),
        },
      },
      minify: 'esbuild',
    },
    esbuild: {
      drop: mode === 'serve' ? [] : ['console'],
    },
  };
  return config;
});
