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
                        paypalURL: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
                        version : '<%= pkg.version %>'
                    }
                }
            },
            prod: {
                options: {
                    dest: 'www/js/config.js'
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
                        ],
                        version : '<%= pkg.version %>'
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
            prodApp: {
                src: [
                    'src/modules/**/*.js',
                    '!src/modules/**/*.spec.js'
                ],
                dest: 'prod/js/scripts.js'
            },
            prodCss: {
                src: ['src/modules/**/css/*.scss'],
                dest: 'prod/css/style.css'
            }
        },
        babel: {
            options: {
                presets: ["es2015"],
                plugins: ['transform-react-jsx'],
                compact: false
            },
            dev: {
                files: {
                    'src/js/scripts.js': 'src/js/scripts.js'
                }
            },
            prod: {
                files: {
                    'prod/js/scripts.js': 'prod/js/scripts.js'
                }
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
                dest: 'www/js/scripts.js',
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
                    'www/index.html': 'www/index.html'
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
                dest:'www/js/templates.js'
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
                src: 'prod/js/scripts.js',
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
                    'www/css/style.css': 'www/css/style.css'
                }
            },
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
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
                dest: "www/i18n/en.json"
            }
        },
        watch: {
            jsApp: {
                files: [
                    'src/modules/**/*.js',
                    '!src/modules/**/*.spec.js'
                ],
                tasks: ['newer:concat:devApp', 'babel:dev', 'wrap:dev']
            },
            jsLibs: {
                files: ['src/libs/*.js'],
                tasks: ['newer:concat:devLibs']
            },
            css: {
                files: ['src/modules/**/*.scss'],
                tasks: ['newer:concat:devCss', 'file_append:dev', 'sass:dev'],
            },
            indexHtml : {
                files: ['src/modules/**/partials/*.html', './index.html'],
                tasks: ['ngtemplates:test', 'env:dev', 'preprocess:dev']
            },
            templates: {
                files: ['src/modules/**/partials/*.html'],
                tasks: ['ngtemplates:dev']
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
                        ui: 'let-bdd'
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
        file_append: {
            dev: {
                files: [{
                    prepend: "$asset-url: '../assets';",
                    input: 'src/css/style.css',
                    output: 'src/css/style.css'
                }]
            },
            prod: {
                files: [{
                    prepend: "$asset-url: '../assets';",
                    input: 'src/css/style.css',
                    output: 'www/css/style.css'
                }]
            }
        },
        preprocess : {
            dev: {
                src : './index.html',
                dest : './src/index.html',
                options : {
                    context : {
                        version : '<%= pkg.version %>'
                    }
                }
            },
            testing: {
                src : './index.html',
                dest : './testing/index.html',
                options : {
                    context : {
                        version : '<%= pkg.version %>'
                    }
                }
            },
            prod : {
                src : './index.html',
                dest : './www/index.html',
                options : {
                    context : {
                        version : '<%= pkg.version %>'
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
                    dest: '<%= pkg.version %>/mobile-onboarding/',
                    src: ['css/style.css', 'js/*.js']
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: 'www/',
                    dest: '<%= pkg.version %>/www/',
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
            // terms: {
            //     files: [{
            //         expand: true,
            //         cwd: 'assets/terms/',
            //         dest: 'terms/',
            //         src: ['**']
            //     }]
            // }
        }
    });

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
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-babel');

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
            'babel:dev',
            'concat:devLibs',
            'file_append:dev',
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
            'file_append:prod',
            'wrap:prod',
            'htmlmin',
            'ngtemplates:prod',
            'concat:prodApp',
            'babel:prod',
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

    grunt.registerTask('blob-testing', [
        'env:configCDN',
        'azure-blob:testing',
        'azure-blob:images'
    ]);
};
