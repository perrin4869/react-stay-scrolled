const env = process.env.NODE_ENV;

module.exports = {
  presets: [
    (env !== 'test') ? '@babel/env' : ['@babel/env', {
      targets: {
        browsers: ['chrome >= 60', 'firefox >= 56'], // Test in these browsers is enough
      },
    }],
    '@babel/react',
  ],
  plugins: [
    '@babel/proposal-class-properties',
  ].concat(env === 'test' ? [
    ['istanbul', { exclude: ['test/*.jsx'] }],
  ] : []),
};
