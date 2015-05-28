/*
 * angular-lfmo
 * http://github.com/aeby/angular-lfmo
 *
 * Copyright (c) 2014-2015 Reto Aebersold
 * Licensed under the MIT license. <https://github.com/aeby/angular-lfmo/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';

  require('jit-grunt')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');
  var banner = '/*!\n' +
    '* angular-lfmo\n' +
    '* @version <%= pkg.version %> - Homepage <>\n' +
    '* @author Reto Aebersold <aeby@substyle.ch>\n' +
    '* @copyright (c) 2015 Reto Aebersold <https://github.com/aeby/>\n' +
    '* @license MIT <https://github.com/aeby/angular-lfmo/blob/master/LICENSE>\n' +
    '*\n' +
    '* @overview Simple models for localforage.\n' +
    '*/\n';

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      dist: ['dist/']
    },
    concat: {
      options: {
        banner: banner,
      },
      dist: {
        src: 'src/angular-lfmo.js',
        dest: 'dist/angular-lfmo.js',
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          'src/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },
    watch: {
      dist: {
        files: ['src/*.js'],
        tasks: ['build']
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: '*.js',
          dest: 'dist'
        }]
      }
    },
    uglify: {
      main: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/angular-lfmo.min.map',
          banner: banner
        },
        files: {
          'dist/angular-lfmo.min.js': ['dist/angular-lfmo.js']
        }
      }
    },
    karma: {
      options: {
        configFile: 'test/karma.conf.js'
      },
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false,
        preprocessors: {}
      },
      min: {
        browsers: ['PhantomJS'],
        options: {
          files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/localforage/dist/localforage.js',
            'dist/angular-lfmo.min.js',
            'test/spec/*.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('version', function (filePath) {
    var file = grunt.file.read(filePath);

    file = file.replace(/<%= pkg\.version %>/gi, pkg.version);

    grunt.file.write(filePath, file);
  });

  grunt.registerTask('build', [
    'clean',
    'newer:jshint',
    'concat',
    'ngAnnotate',
    'uglify'
  ]);
  grunt.registerTask('go', ['build', 'watch:dist']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('test', ['build', 'karma:min']);
};
