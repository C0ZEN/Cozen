// Generated on 2016-11-30 using generator-angular 0.15.1
'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates  : 'grunt-angular-templates',
    cdnify       : 'grunt-google-cdn'
  });

  // Configurable paths for the application
  var appConfig = {
    app      : require('./bower.json').appPath || 'app',
    dist     : 'dist',
    release  : 'release',
    languages: grunt.file.readJSON('app/config.json').languages,
    themes   : grunt.file.readJSON('app/config.json').themes
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower     : {
        files: [
          'bower.json',
          '<%= yeoman.app %>/config.json',
          '<%= yeoman.app %>/directives/**/*.json'
        ],
        tasks: ['autoFill']
      },
      js        : {
        files  : ['<%= yeoman.app %>/**/*.js'],
        tasks  : ['newer:jshint:all', 'newer:jscs:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest    : {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
      },
      styles    : {
        files: ['<%= yeoman.app %>/styles/**/*.css'],
        tasks: ['less:serve', 'cssmin:serve', 'newer:copy:styles', 'postcss']
      },
      less      : {
        files: ['<%= yeoman.app %>/**/*.less'],
        tasks: ['less:serve', 'cssmin:serve', 'newer:copy:styles', 'postcss']
      },
      gruntfile : {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files  : [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options   : {
        port      : 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname  : 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open      : true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test      : {
        options: {
          port      : 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist      : {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all    : {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/**/*.js'
        ]
      },
      test   : {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src    : ['test/spec/**/*.js']
      }
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config : '.jscsrc',
        verbose: true
      },
      all    : {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/**/*.js'
        ]
      },
      test   : {
        src: ['test/spec/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist   : {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/**/*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server : '.tmp',
      release: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.release %>/**/*'
          ]
        }]
      }
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')()
        ]
      },
      server : {
        options: {
          map: true
        },
        files  : [{
          expand: true,
          cwd   : '.tmp/styles/',
          src   : '**/*.css',
          dest  : '.tmp/styles/'
        }]
      },
      dist   : {
        files: [{
          expand: true,
          cwd   : '.tmp/styles/',
          src   : '**/*.css',
          dest  : '.tmp/styles/'
        }]
      },
      release: {
        files: [{
          expand: true,
          cwd   : '.tmp/styles/',
          src   : '**/*.css',
          dest  : '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app : {
        src       : ['<%= yeoman.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src            : '<%= karma.unit.configFile %>',
        ignorePath     : /\.\.\//,
        fileTypes      : {
          js: {
            block  : /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect : {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/**/*.js',
          '<%= yeoman.dist %>/styles/**/*.css',
          '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html   : '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js : ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post : {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html   : ['<%= yeoman.dist %>/**/*.html'],
      css    : ['<%= yeoman.dist %>/styles/**/*.css'],
      js     : ['<%= yeoman.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ],
        patterns  : {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    uglify: {
      dist   : {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      },
      release: {
        files: {
          '<%= yeoman.release %>/cozen.min.js': [
            '<%= yeoman.app %>/**/*.js',
            '!<%= yeoman.app %>/**/*.tpl.js'
          ]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd   : '<%= yeoman.app %>/images',
          src   : '**/*.{png,jpg,jpeg,gif}',
          dest  : '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd   : '<%= yeoman.app %>/images',
          src   : '**/*.svg',
          dest  : '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist   : {
        options: {
          collapseWhitespace       : true,
          conservativeCollapse     : true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA  : true
        },
        files  : [{
          expand: true,
          cwd   : '<%= yeoman.dist %>',
          src   : ['*.html'],
          dest  : '<%= yeoman.dist %>'
        }]
      },
      release: {
        options: {
          collapseWhitespace       : true,
          conservativeCollapse     : true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA  : true
        },
        files  : [{
          expand: true,
          cwd   : '<%= yeoman.app %>/directives',
          src   : ['**/*.html'],
          dest  : '<%= yeoman.release %>/directives'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module : 'cozenLib',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin : 'scripts/scripts.js'
        },
        cwd    : '<%= yeoman.app %>',
        src    : 'views/**/*.html',
        dest   : '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd   : '.tmp/concat/scripts',
          src   : '*.js',
          dest  : '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist     : {
        files: [{
          expand: true,
          dot   : true,
          cwd   : '<%= yeoman.app %>',
          dest  : '<%= yeoman.dist %>',
          src   : [
            '*.{ico,png,txt}',
            '*.html',
            'images/**/*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd   : '.tmp/images',
          dest  : '<%= yeoman.dist %>/images',
          src   : ['generated/*']
        }, {
          expand: true,
          cwd   : 'bower_components/bootstrap/dist',
          src   : 'fonts/*',
          dest  : '<%= yeoman.dist %>'
        }]
      },
      styles   : {
        expand: true,
        cwd   : '<%= yeoman.app %>/styles',
        dest  : '.tmp/styles/',
        src   : '**/*.css'
      },
      release  : {
        expand : true,
        flatten: true,
        cwd    : '<%= yeoman.app %>/directives',
        dest   : '.tmp/release/directives',
        src    : [
          '**/*.js',
          '!**/*.tpl.js'
        ]
      },
      languages: {
        expand: true,
        cwd   : '<%= yeoman.app %>/languages',
        dest  : '<%= yeoman.release %>/languages',
        src   : '*.json'
      },
      config   : {
        expand: true,
        cwd   : '<%= yeoman.app %>',
        dest  : '<%= yeoman.release %>',
        src   : 'config.json'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server : [
        'copy:styles'
      ],
      test   : [
        'copy:styles'
      ],
      dist   : [
        'copy:styles',
        'imagemin',
        'svgmin'
      ],
      release: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun : true
      }
    },

    angularFileLoader: {
      options: {
        scripts : [
          '<%= yeoman.app %>/**/*.js',
          '!<%= yeoman.app %>/**/*.tpl.js'
        ],
        startTag: 'cozen-js-start',
        endTag  : 'cozen-js-end'
      },
      index  : {
        src: ['<%= yeoman.app %>/index.html']
      }
    },

    // When adding a new theme,
    // You need to add the task for less and cssmin
    less  : {
      serve  : {
        options: {
          plugins: [
            new (require('less-plugin-autoprefix'))()
          ]
        },
        files  : [
          {'<%= yeoman.app %>/styles/themes/tau/tau.min.css': '<%= yeoman.app %>/styles/themes/tau/import.tau.less'},
          {'<%= yeoman.app %>/styles/themes/atom/atom.min.css': '<%= yeoman.app %>/styles/themes/atom/import.atom.less'}
        ]
      },
      release: {
        options: {
          plugins: [
            new (require('less-plugin-autoprefix'))()
          ]
        },
        files  : [
          {'.tmp/release/themes/tau.css': '<%= yeoman.app %>/styles/themes/tau/import.tau.less'},
          {'.tmp/release/themes/min/tau.min.css': '<%= yeoman.app %>/styles/themes/tau/import.tau.less'},
          {'.tmp/release/themes/atom.css': '<%= yeoman.app %>/styles/themes/atom/import.atom.less'},
          {'.tmp/release/themes/min/atom.min.css': '<%= yeoman.app %>/styles/themes/atom/import.atom.less'}
        ]
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      serve  : {
        files: [
          {'<%= yeoman.app %>/styles/themes/tau/tau.min.css': '<%= yeoman.app %>/styles/themes/tau/tau.min.css'},
          {'<%= yeoman.app %>/styles/themes/atom/atom.min.css': '<%= yeoman.app %>/styles/themes/atom/atom.min.css'}
        ]
      },
      release: {
        files: [
          {'.tmp/release/themes/min/tau.min.css': '.tmp/release/themes/min/tau.min.css'},
          {'.tmp/release/themes/min/atom.min.css': '.tmp/release/themes/min/atom.min.css'},
          {'.tmp/release/reset.min.css': '<%= yeoman.app %>/styles/reset.css'}
        ]
      }
    },

    "merge-json": {
      i18n: {
        files: {
          '<%= yeoman.app %>/languages/fr.concat.json': ['<%= yeoman.app %>/directives/**/*.fr.json'],
          '<%= yeoman.app %>/languages/en.concat.json': ['<%= yeoman.app %>/directives/**/*.en.json']
        }
      }
    },

    preprocess: {
      options: {
        context: {
          CONFIG: grunt.file.read('app/config.json')
        }
      },
      config : {
        src : '<%= yeoman.app %>/directives/utils/app.constant.tpl.js',
        dest: '<%= yeoman.app %>/directives/utils/app.constant.js'
      }
    },

    concat: {
      js : {
        src : '.tmp/release/directives/*.js',
        dest: '<%= yeoman.release %>/cozen.js'
      },
      css: {
        files: [
          {'<%= yeoman.release %>/cozen.min.css': '.tmp/release/themes/min/*.css'},
          {'<%= yeoman.release %>/cozen.css': '.tmp/release/themes/*.css'},
          {'<%= yeoman.release %>/optional.reset.min.css': '.tmp/release/reset.min.css'}
        ]
      }
    },

    tags: {
      serve: {
        options: {
          linkTemplate: '<link href="{{ path }}" rel="stylesheet"/>',
          openTag     : '<!-- Start theme template styles -->',
          closeTag    : '<!-- End theme template styles -->'
        },
        src    : '<%= yeoman.app %>/styles/themes/**/*.min.css',
        dest   : '<%= yeoman.app %>/index.html'
      }
    }
  });

  grunt.loadNpmTasks('grunt-script-link-tags');

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'autoFill',
      'less:serve',
      'cssmin:serve',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'autoFill',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'autoFill',
    'less:serve',
    'cssmin:serve',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('release', [
    'clean:release',   // Delete the .tmp folder and release content folder
    'languages',       // Concat the languages files
    'preprocess',      // Build the templates files
    'less:release',    // Transform less to css and add them to the release folder
    'cssmin:release',  // Make the css better
    'uglify:release',  // Copy and min all the js into the release folder
    'htmlmin:release', // Copy and min all the html into the release folder
    'copy:release',    // Copy all the js into the .tmp folder
    'concat:js',       // Copy all the js into the release folder
    'concat:css',      // Copy all the css into the release folder
    'copy:languages',  // Copy the languages folder into the release folder
    'copy:config'      // Copy the config
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
  ]);

  grunt.registerTask('autoFill', [
    'preprocess',
    'wiredep',
    'angularFileLoader',
    'languages',
    'tags:serve'
  ]);

  grunt.registerTask('languages', 'Languages task to compile the .json', [
    'merge-json:i18n'
  ]);
};
