module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
       build: {
         src: [
           'src/modules/**/css/*.scss',
         ],
         dest: 'build/css/build.css'
       },
       //TODO - make this a temp file so we don't leave it lying around
       src: {
         src: [
           'src/modules/**/css/*.scss',
         ],
         dest: 'src/css/build.css'
       },
       //concat src scripts so we can debug
       //TODO - figure out how to do this on watch without css files included
       srcApp: {
        src: [
          'src/modules/**/*.js',
        ],
        dest: 'src/js/scripts.js'
       },
       srcLibs: {
        src: [
          'src/libs/*.js',
        ],
        dest: 'src/js/libs.js'
       }
     },
     wrap:{
      basic: {
        src: ['src/js/scripts.js'],
        dest: 'src/js/scripts.js',
        options: {
          wrapper: ["'use strict';\n(function(){", "})();"]
        }
      }
     },
     htmlmin: {                                     // Task
       build: {                                      // Target
         options: {                                 // Target options
           removeComments: true,
           collapseWhitespace: true
         },
         files: {                                   // Dictionary of files
           'build/index.html': 'src/index.html'
         }
       }
     },
     //TODO - concat and use 1 app.js file
     ngtemplates:      {
       build:          {
         options:      {
           module:     'coachSeekApp',         // (Optional) The module the templates will be added to
            htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true }
         },
         cwd: 'src/modules',
         src:          '**/partials/**.html',
         dest:         'build/js/templates.js'
       },
       src:{
         options:      {
           base:       'src/modules',        // $templateCache ID will be relative to this folder
           module:     'coachSeekApp'               // (Optional) The module the templates will be added to
                                           //            Defaults to grunt target name (e.g. `myapp`)
         },
         cwd: 'src/modules',
         src:          '**/partials/**.html',
         dest:         'src/js/templates.js'
       }
     },
     //TODO - switch to ng-annotate?
     uglify: {
       buildApp: {
         src: 'src/modules/**/*.js',
         dest: 'build/js/scripts.js'
       },
       buildLibs: {
         src: 'src/libs/*.js',
         dest: 'build/js/libs.js'
       }
     },
    sass: {
      build: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/css/style.css': 'build/css/build.css'
        }
      },
      src: {
        options: {
          style: 'expanded'
        },
        files: {
          'src/css/style.css': 'src/css/build.css'
        }
      }
    },
    watch: {
      js: {
        files: ['src/modules/**/*.js'],
        tasks: ['concat', 'wrap']
      },
      css: {
        files: ['src/css/*.scss'],
        tasks: ['concat', 'sass'],
      },
      templates: {
        files: ['src/modules/**/partials/*.html'],
        tasks: ['ngtemplates']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-wrap');

  // Default task(s).
  // TODO - jshint
  grunt.registerTask('default', ['concat', 'wrap', 'htmlmin', 'ngtemplates', 'uglify', 'sass']);

};