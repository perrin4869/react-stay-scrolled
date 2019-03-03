module.exports = api => ({
  presets: [
    (api.env() !== 'test') ? '@babel/env' : ['@babel/env', {
      targets: {
        browsers: ['chrome >= 60', 'firefox >= 56'], // Test in these browsers is enough
      },
    }],
    '@babel/react',
  ],
  plugins: api.env() === 'test' ? [['istanbul', { exclude: ['test/*.jsx'] }]] : [],
});
