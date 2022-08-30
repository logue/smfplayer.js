import { checker } from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

/** @type {UserConfig} https://vitejs.dev/config/ */
const config = {
  // https://vitejs.dev/config/#base
  base: './',
  // https://vitejs.dev/config/#server-options
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: '$1',
      },
    ],
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
    minify: 'terser',
    terserOptions: {
      ecma: 2020,
      compress: { drop_console: true },
      mangle: true, // Note `mangle.properties` is `false` by default.
      module: true,
      output: { comments: true, beautify: false },
    },
  },
};

// Export vite config
export default defineConfig(async ({ command }) => {
  // Hook production build.
  // Write meta data.

  fs.writeFileSync(
    path.resolve(path.join(__dirname, 'src/meta.js')),
    `// This file is auto-generated by the build system.
const meta = {
  version: '${require('./package.json').version}',
  date: '${new Date().toISOString()}',
};
export default meta;
`
  );

  return config;
});
