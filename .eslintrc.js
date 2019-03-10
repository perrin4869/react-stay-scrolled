module.exports = {
  extends: 'airbnb',
  env: {
    browser: true
  },
  rules: {
    'no-multi-assign': 'off',
    'max-len': ['error', 150],
    'new-cap': [2, {
      capIsNewExceptions: ['Velocity']
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'test/**',
        'karma.conf.js',
        'rollup.config.js',
        'examples/rollup.config.js',
      ]
    }]
  }
}
