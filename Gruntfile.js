module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngconstant: {
            // Options for all targets
            options: {
                name: 'envConfig',
            },
            // Environment targets
            dev: {
                options: {
                    dest: 'src/js/config.js'
                },
                constants: {
                    ENV: {
                        name: 'dev',
                        defaultSubdomain: 'app-testing',
                        apiURL: 'https://api-testing.coachseek.com',
                        paypalURL: 'https://www.sandbox.paypal.com/cgi-bin/webscr'
                    }
                }
            },
            prod: {
                options: {
                    dest: 'prod/js/config.js'
                },
                constants: {
                    ENV: {
                        name: 'prod',
                        defaultSubdomain: 'app',
                        apiURL: 'https://api.coachseek.com',
                        paypalURL: 'https://www.paypal.com/cgi-bin/webscr',
                        allFeaturesWhitelist: [
                            're@d.e',
                            'ian@coachseek.com',
                            'denym@coachseek.com',
                            'demo@coachseek.com',
                            'sam@som2y.com',
                            'olaf@coachseek.com',
                            'olaf+1@coachseek.com',
                            'hannah@coachseek.com',
                            'matt@coachseek.com',
                            'mattwilliamson94@hotmail.com',
                            'samyin1990@hotmail.com',
                            'josh+msports@coachseek.com'
                        ]
                    }
                }
            }
        },
        jshint: {
            ignore_warning: {
                src: [
                    'src/modules/**/*.js',
                    '!src/modules/**/*.spec.js'
                ],
            },
        },
        concat: {
            devCss: {
                src: ['src/modules/**/css/*.scss'],
                dest: 'src/css/style.css'
            },
            devApp: {
                src: [
                    'src/modules/**/*.js',
                    '!src/modules/**/*.spec.js'
                ],
                dest: 'src/js/scripts.js'
            },
            devLibs: {
                src: ['src/libs/*.js'],
                dest: 'src/js/libs.js'
            },
            prodCss: {
                src: ['src/modules/**/css/*.scss'],
                dest: 'prod/css/style.css'
            }
        },
        wrap:{
            dev: {
                src: ['src/js/scripts.js'],
                dest: 'src/js/scripts.js',
                options: {
                    wrapper: ["'use strict';\n(function(){", "})();"]
                }
            },
            prod: {
                src: ['src/js/scripts.js'],
                dest: 'prod/js/scripts.js',
                options: {
                    wrapper: ["'use strict';\n(function(){", "})();"]
                }
            }
        },
        htmlmin: {                                     // Task
            prod: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'prod/index.html': 'prod/index.html'
                }
            }
        },
        //TODO - concat and use 1 app.js file
        ngtemplates:{
            prod:{
                options:{
                    module:'app',         // (Optional) The module the templates will be added to
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                },
                cwd: 'src/modules',
                src:'**/partials/*.html',
                dest:'prod/js/templates.js'
            },
            dev:{
                options:{
                    base:'src/modules',        // $templateCache ID will be relative to this folder
                    module:'app'               // (Optional) The module the templates will be added to
                },
                cwd: 'src/modules',
                src: '**/partials/*.html',
                dest: 'src/js/templates.js'
            },
            test: {
                options:{
                    module: 'app',
                },
                cwd: 'src',
                src: 'index.html',
                dest: 'src/js.spec/testTemplates.js'
            }
        },
        //TODO - switch to ng-annotate?
        uglify: {
            prodApp: {
                src: [
                    'src/modules/**/*.js',
                    '!src/modules/**/*.spec.js'
                ],
                dest: 'prod/js/scripts.js'
            },
            prodLibs: {
                src: 'src/libs/*.js',
                dest: 'prod/js/libs.js'
            }
        },
        sass: {
            prod: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'prod/css/style.css': 'prod/css/style.css'
                }
            },
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'src/css/style.css': 'src/css/style.css'
                }
            }
        },
        "merge-json": {
            i18nDev: {
                src: [ "src/modules/**/i18n/en/*.json" ],
                dest: "src/i18n/en.json"
            },
            i18nTesting: {
                src: [ "src/modules/**/i18n/en/*.json" ],
                dest: "testing/i18n/en.json"
            },
            i18nProd: {
                src: [ "src/modules/**/i18n/en/*.json" ],
                dest: "prod/i18n/en.json"
            }
        },
        watch: {
            jsApp: {
                files: [
                    'src/modules/**/*.js',
                    '!src/modules/**/*.spec.js'
                ],
                tasks: ['newer:concat:devApp', 'wrap:dev']
            },
            jsLibs: {
                files: ['src/libs/*.js'],
                tasks: ['newer:concat:devLibs']
            },
            css: {
                files: ['src/modules/**/*.scss'],
                tasks: ['newer:concat:dvCss', 'sass:dev'],
            },
            templates: {
                files: ['src/modules/**/partials/*.html', 'src/index.html'],
                tasks: ['ngtemplates:dev', 'ngtemplates:test']
            },
            i18n: {
                files: ['src/modules/**/i18n/en/*.json'],
                tasks: ['merge-json:i18nDev']
            }
        },
        karma: {
            unit: {
                configFile: 'karma.config.js',
                client: {
                    mocha: {
                        reporter: 'html', // change Karma's debug.html to the mocha web reporter
                        ui: 'letbdd'
                    }
                }
            }
        },
        plato: {
            your_task: {
                files: {
                    'reports/plato': [
                        'src/modules/**/*.js',
                        '!src/modules/**/*.spec.js'
                    ]
                }
            }
        },
        connect: {
            src: {
                options: {
                    port: 8000,
                    keepalive: true,
                    // base: 'src'
                }
            }
        },
        env : {
            configCDN : {
                AZURE_STORAGE_ACCOUNT : 'coachseekassets',
                AZURE_STORAGE_ACCESS_KEY : 'ojFm6jWTalMxuD6HkWnGrsqoV1dPYVwEptvOIKrBq+19xdtVmKgneK8s9PGFwLRDF+/4ybouo5QqT//WGLhaRg=='
            },
            dev: {
                env: 'development'
            },
            testing: {
                env: 'testing'
            },
            prod: {
                env: 'production'
            }
        },
        preprocess : {
            dev: {
                src : './index.html',
                dest : './src/index.html'
            },
            testing: {
                src : './index.html',
                dest : './testing/index.html',
                options : {
                    context : {
                        version : '<%= pkg.version %>',
                    }
                }
            },
            prod : {
                src : './index.html',
                dest : './prod/index.html',
                options : {
                    context : {
                        version : '<%= pkg.version %>',
                    }
                }
            }
        },
        'azure-blob': {
            options: { // global options applied to each task
                containerName: 'assets',
                containerDelete: false, //do not apply true here, container would be deleted at each task
                metadata: {cacheControl: 'public, max-age=31556926'}, // max-age 1 year for all entries
                gzip: true,
                copySimulation: false  // set true: only dry-run what copy would look like
            },
            testing: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    dest: '<%= pkg.version %>/testing/',
                    src: ['css/style.css', 'js/*.js']
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: 'prod/',
                    dest: '<%= pkg.version %>/prod/',
                    src: ['css/style.css', 'js/*.js']
                }]
            },
            images: {
                files: [{
                    expand: true,
                    cwd: 'assets/pics/',
                    dest: '<%= pkg.version %>/pics/',
                    src: ['**']
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-merge-json');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-azure-blob');
    grunt.loadNpmTasks('grunt-preprocess');

    // Default task(s).
    grunt.registerTask('default', [
            'dev',
            'testing',
            'prod'
        ]
    );

    grunt.registerTask('dev', [
            'env:dev',
            'preprocess:dev',
            'concat:devCss',
            'concat:devApp',
            'concat:devLibs',
            'wrap:dev',
            'ngtemplates:dev',
            'sass:dev',
            'merge-json:i18nDev',
            'ngconstant:dev'
        ]
    );
    grunt.registerTask('testing', [
            'env:testing',
            'preprocess:testing',
            'merge-json:i18nTesting',
        ]
    );
    grunt.registerTask('prod',[
            'env:prod',
            'preprocess:prod',
            'concat:prodCss',
            'wrap:prod',
            'htmlmin',
            'ngtemplates:prod',
            'uglify',
            'sass:prod',
            'merge-json:i18nProd',
            'ngconstant:prod'
        ]
    );

    grunt.registerTask('blob', [
        'env:configCDN',
        'azure-blob'
    ]);

};
