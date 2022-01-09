import nodeResolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/sw.js',
  output: {
    entryFileNames: '[name].js',
    format: 'es',
    dir: '.tmp',
  },
  plugins: [
    summary({
      showMinifiedSize: false,
    }),
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    nodeResolve(),
    terser(),
  ],
};
