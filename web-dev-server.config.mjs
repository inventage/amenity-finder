import _replace from '@rollup/plugin-replace';
import { fromRollup } from '@web/dev-server-rollup';
import { publicResolvePlugin } from './plugins/wds-public-resolve-plugin.mjs';

const replace = fromRollup(_replace);

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  watch: true,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  appIndex: 'index.html',
  plugins: [
    publicResolvePlugin(),
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      __BUILD_VERSION__: 'dev',
    }),
  ],
});
