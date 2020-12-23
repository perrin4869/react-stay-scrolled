module.exports = {
  extends: ['plugin:mocha/recommended'],
  plugins: ['mocha'],
  env: {
    mocha: true,
    browser: true,
  },
  globals: {
    chai: true,
    sinon: true,
  },
  rules: {
    'mocha/no-mocha-arrows': 0, // https://mochajs.org/#arrow-functions
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
  },
};
