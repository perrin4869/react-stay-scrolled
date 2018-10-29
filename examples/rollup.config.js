import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import remap from 'rollup-plugin-remap';
import liveServer from 'rollup-plugin-live-server';

const env = process.env.NODE_ENV || 'development';

export default {
  input: './src/main.jsx',
  plugins: [
    env !== 'production' && remap({
      originalPath: './src/debug.js',
      targetPath: './src/debug.dev.js',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    babel({
      exclude: ['node_modules/**', '../node_modules/**'],
      babelrc: false,
      presets: [
        '@babel/env',
        '@babel/react',
      ],
      plugins: ['@babel/proposal-class-properties'],
    }),
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    commonjs({
      include: ['node_modules/**', '../node_modules/**'],
      namedExports: {
        '../node_modules/react/index.js': ['createElement', 'createContext', 'createRef', 'forwardRef', 'Component'],
        'node_modules/react/index.js': ['PureComponent'],
        'node_modules/react-dom/index.js': ['render'],
      },
    }),
    liveServer({
      port: process.env.PORT || 3000,
      root: 'public',
    }),
  ].filter(Boolean),
  output: {
    file: 'client.js',
    format: 'iife',
    dir: './public',
    name: 'ReactStayScrolledExamples',
    sourcemap: true,
  },
};
