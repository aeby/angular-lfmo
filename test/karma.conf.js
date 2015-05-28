// an example karma.conf.js
module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../',
    frameworks: ['jasmine'],
    plugins: [
      // these plugins will be require() by Karma
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher'
    ],
    autoWatch: false,
    browserNoActivityTimeout: 30000,
    browsers: ['Chrome'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/localforage/dist/localforage.js',
      'src/*.js',
      'test/spec/*.js'
    ],

    // web server port
    port: 9876,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 30000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
