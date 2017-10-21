const env = process.env.NODE_ENV;

module.exports = {
  presets: [
    (env !== 'test') ? 'env' : ['env', {
      modules: false,
      targets: {
        browsers: ['chrome >= 60', 'firefox >= 56'], // Test in this browsers is enough
      }
    }],
    'react',
  ],
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
  ].concat(env === 'test' ? [
    'external-helpers',
    ['istanbul', { exclude: ['test/*.jsx'] }],
  ] : []),
};
