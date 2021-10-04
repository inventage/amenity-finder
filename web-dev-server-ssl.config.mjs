import merge from 'deepmerge';
import config from './web-dev-server.config.mjs';

export default /** @type {import('@web/dev-server').DevServerConfig} */ merge(config, {
  http2: true,
  sslKey: 'localhost.key',
  sslCert: 'localhost.crt',
});
