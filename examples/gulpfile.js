const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gls = require('gulp-live-server');

const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const remap = require('rollup-plugin-remap');

const env = process.env.NODE_ENV || 'development';

gulp.task('lint', () => (
  gulp.src(['src/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format())
));

gulp.task('build', ['lint'], async () => {
  const bundle = await rollup({
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
          '../node_modules/prop-types/index.js': ['object', 'func'],
          '../node_modules/react/index.js': ['createElement', 'createContext', 'createRef', 'forwardRef', 'Component'],
          'node_modules/react/index.js': ['PureComponent'],
          'node_modules/react-dom/index.js': ['render'],
        },
      }),
    ].filter(Boolean),
  });

  const outputOptions = {
    file: 'client.js',
    format: 'iife',
    dir: './',
    name: 'ReactOnEnterKeyDownExamples',
  };

  await bundle.generate(outputOptions);
  return bundle.write(outputOptions);
});

gulp.task('watch', () => {
  gulp.watch('src/*.jsx', ['build']);
});

gulp.task('develop', ['watch'], () => {
  const server = gls.new('server.js');
  server.start();
});

gulp.task('default', ['build']);
