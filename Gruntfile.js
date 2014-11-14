module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
       build: {
         src: [
           'src/css/*.scss',
         ],
         dest: 'build/css/build.css'
       },
       src: {
         src: [
           'src/css/*.scss',
         ],
         dest: 'src/css/build.css'
       },
       //concat src scripts so we can debug
       //TODO - figure out how to do this on watch without css files included
       srcApp: {
        src: [
          'src/js/scripts/*.js',
        ],
        dest: 'src/js/scripts.js'
       },
       srcLibs: {
        src: [
          'src/js/libs/*.js',
        ],
        dest: 'src/js/libs.js'
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
     uglify: {
       buildApp: {
         src: 'src/js/scripts/*.js',
         dest: 'build/js/scripts.js'
       },
       buildLibs: {
         src: 'src/js/libs/*.js',
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
        files: ['src/scripts/app/*.js'],
        tasks: ['concat']
      },
      css: {
        files: ['src/css/*.scss'],
        tasks: ['concat', 'sass'],
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'htmlmin', 'uglify', 'sass']);

};