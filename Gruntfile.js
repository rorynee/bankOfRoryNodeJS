module.exports = function (grunt) {
  
    // Config
    grunt.initConfig({
        // basic setting re plugins
        pkg: grunt.file.readJSON('package.json'),
        
        // Cssmin - compact
        cssmin: {
            options: {
              shorthandCompacting: false,
              roundingPrecision: -1,
               keepSpecialComments: 0
            },
            target: {
              files: {
                'public/stylesheets/main.min.css': ['assets/css/bootstrap.min.css',
                                                    'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
                                                    'assets/css/mystyles.css'],
                
                'public/stylesheets/dashboard.min.css': ['assets/css/layout.css',
                                                         'bower_components/bootstrap/dist/css/bootstrap.min.css',
                                                         'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
                                                         'assets/css/jquery.dataTables.css',
                                                         'assets/css/mystyles.css']
              }
            }
        },
        
        uglify: {
            my_target: {
              files: {
                'public/javascripts/main.min.js': ['bower_components/jquery/dist/jquery.js',
                                            'bower_components/bootstrap/dist/js/bootstrap.min.js',
                                            'bower_components/bootstrap3-ie10-viewport-bug-workaround/ie10-viewport-bug-workaround.js'],
                                        
                'public/javascripts/dashboard.min.js': ['bower_components/jquery/dist/jquery.js',
                                            'assets/js/hideshow.js',
                                            'bower_components/angular/angular.min.js',
					    'bower_components/angular-route/angular-route.min.js',
					    'assets/js/jquery.tablesorter.min.js',
                                            'assets/js/jquery.equalHeight.js',
                                            'assets/js/jquery.dataTables.js',
                                            'assets/js/mystyles.js'],
                                        
                'public/javascripts/myangular.js': ['assets/js/myangular.js']                        
              }
            }
        },
        watch: {
            css: {
              files: ['public/stylesheets/mystyles.css'],
              tasks: ['cssmin']
            },
            js: {
              files: ['public/javascripts/mystyles.js'],
              tasks: ['uglify']
            },
            angular: {
                files: ['assets/js/myangular.js'],
                tasks: ['uglify']
            }
        }
    });

  // Load the plugin
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //grunt.loadNpmTasks('grunt-execute');
  
  // Fire the task off
  grunt.registerTask("default", ['cssmin','uglify']);
  
  grunt.registerTask("watch-css", ['watch:css']);
  grunt.registerTask("watch-js", ['watch:js']);
  grunt.registerTask("watch-angular", ['watch:angular']); // Used during dev of Angular Functionality
    
};
