const env = process.env.NODE_ENV;

module.exports = {
  presets: [
    (env === 'test') ? 'es2015-rollup' : 'es2015',
    'react',
  ].concat(env === 'test' ? ['es2017'] : []),
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
  ].concat(env === 'test' ? [
    ['istanbul', { exclude: ['test/*.jsx'] }],
    ['transform-runtime', {
      polyfill: false,
      regenerator: true,
    }],
  ] : []),
};
