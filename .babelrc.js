const env = process.env.NODE_ENV;

module.exports = {
  presets: [
    (env === 'test') ? 'es2015-rollup' : 'es2015',
    'react',
  ],
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
  ].concat(env === 'test' ? [
    ['istanbul', { exclude: ['test/*.jsx'] }],
  ] : []),
};
