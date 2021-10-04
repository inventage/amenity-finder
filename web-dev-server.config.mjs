import { publicResolvePlugin } from './plugins/wds-public-resolve-plugin.mjs';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  watch: true,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  appIndex: 'index.html',
  plugins: [publicResolvePlugin()],
  http2: true,
  sslKey: 'localhost.key',
  sslCert: 'localhost.crt',
});
