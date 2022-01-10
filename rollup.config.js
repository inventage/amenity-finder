import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import summary from 'rollup-plugin-summary';
import html from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { terser } from 'rollup-plugin-terser';
import { injectManifest } from 'rollup-plugin-workbox';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';

import pkg from './package.json';

const BUILD_VERSION =
  process.env.GITHUB_RUN_ID && process.env.GITHUB_SHA
    ? `${pkg.version}-${new Date().toISOString()}-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_SHA.substr(0, 7)}`
    : process.env.BUILD_VERSION || 'n/a';
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
      injectServiceWorker: false,
      // serviceWorkerPath: 'dist/sw.js',
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
    // @see https://github.com/modernweb-dev/web/tree/master/packages/rollup-plugin-workbox
    // @see https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest
    injectManifest({
      swSrc: '.tmp/sw.js',
      swDest: 'dist/sw.js',
      globDirectory: 'dist',
      globPatterns: ['**/*.{html,js,css,webmanifest,png,txt,map}'],
      // globIgnores: ['robots.txt'],
    }),
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      __ENABLE_SW__: true,
      __BUILD_VERSION__: BUILD_VERSION,
    }),
  ],
};
