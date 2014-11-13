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
       srcApp: {
        src: [
          'src/scripts/app/*.js',
        ],
        dest: 'src/scripts/app.js'
       },
       srcLibs: {
        src: [
          'src/scripts/libs/*.js',
        ],
        dest: 'src/scripts/libs.js'
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
         src: 'src/scripts/app/*.js',
         dest: 'build/scripts/app.js'
       },
       buildLibs: {
         src: 'src/scripts/libs/*.js',
         dest: 'build/scripts/libs.js'
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