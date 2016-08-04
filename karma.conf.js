// Karma configuration
// Generated on Wed May 11 2016 23:26:57 GMT+0900 (JST)

module.exports = function(config) {
  const configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'test/*.js?(x)'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/*.js?(x)': ['webpack', 'sourcemap'],
      'src/*.js': ['webpack', 'sourcemap', 'coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: {
      module: {
        preLoaders: [{
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
            loader: 'isparta'
        }],
        loaders: [{
          test: /\.js?(x)$/,
          exclude: /node_modules\//,
          loader: 'babel-loader'
        }]
      },
      devtool: 'inline-source-map'
    },

    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type : 'html' },
        { type : 'lcov' }
      ]
    }
  };

  if (process.env.TRAVIS) {
    configuration.reporters.push('coveralls');
    configuration.browsers[0] = 'Chrome_travis_ci';
  }

  config.set(configuration);
}
