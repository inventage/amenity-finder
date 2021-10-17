import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import summary from 'rollup-plugin-summary';
import html from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { terser } from 'rollup-plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';

import path from 'path';
import pkg from './package.json';

const BUILD_VERSION =
  process.env.GITHUB_RUN_ID && process.env.GITHUB_SHA
    ? `${pkg.version}-${new Date().toISOString()}-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_SHA.substr(0, 7)}`
    : 'n/a';
console.info(`BUILD_VERSION = ${BUILD_VERSION}`);

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[name]-[hash].js',
    chunkFileNames: '[name]-[hash].js',
    assetFileNames: '[name]-[hash][extname]',
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    html({
      minify: false,
      injectServiceWorker: true,
      serviceWorkerPath: 'dist/sw.js',
    }),
    summary({
      showMinifiedSize: false,
    }),
    nodeResolve(),
    terser(),
    importMetaAssets(),
    copy({
      targets: [
        { src: 'public/**', dest: 'dist', flatten: false },
        { src: 'public/.well-known', dest: 'dist' },
      ],
    }),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: ['last 3 Chrome major versions', 'last 3 Firefox major versions', 'last 3 Edge major versions', 'last 3 Safari major versions'],
            modules: false,
            bugfixes: true,
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-template-html-minifier'),
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    /** Create and inject a service worker */
    generateSW({
      navigateFallback: '/index.html',
      // where to output the generated sw
      swDest: path.join('dist', 'sw.js'),
      // directory to match patterns against to be precached
      globDirectory: path.join('dist'),
      // cache any html js and css by default
      globPatterns: ['**/*.{html,js,css,webmanifest,png,txt}'],
      skipWaiting: true,
      clientsClaim: true,
      mode: 'production',
    }),
    replace({
      preventAssignment: false,
      __BUILD_VERSION__: BUILD_VERSION,
    }),
  ],
};
