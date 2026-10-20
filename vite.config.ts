import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: 'settlement-pdf-font',
      resolveId(id) {
        if (id === 'virtual:settlement-font')
          return '\0virtual:settlement-font';
      },
      load(id) {
        if (id === '\0virtual:settlement-font')
          return `export default ${JSON.stringify(readFileSync(new URL('./app/assets/settlement-inter-regular.ttf', import.meta.url)).toString('base64'))}`;
      },
    },
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
