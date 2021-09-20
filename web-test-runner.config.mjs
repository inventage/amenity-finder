import { publicResolvePlugin } from './plugins/wds-public-resolve-plugin.mjs';

const filteredLogs = ['Running in dev mode', 'Lit is in dev mode', 'Multiple versions of Lit loaded'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: 'test/**/*.test.js',
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  plugins: [publicResolvePlugin()],

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  /** Amount of browsers to run concurrently */
  concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  concurrency: 2,
});
