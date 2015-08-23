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
                'public/stylesheets/main.min.css': ['public/stylesheets/bootstrap.min.css',
                                                    'public/stylesheets/bootstrap-theme.min.css',
                                                    'public/stylesheets/mystyles.css'],
                
                'public/stylesheets/dashboard.min.css': ['public/stylesheets/layout.css',
                                                         'public/stylesheets/bootstrap.min.css',
                                                         'public/stylesheets/bootstrap-theme.min.css',
                                                         'public/stylesheets/jquery.dataTables.css',
                                                         'public/stylesheets/mystyles.css']
              }
            }
        },
        
        uglify: {
            my_target: {
              files: {
                'public/javascripts/main.min.js': ['public/javascripts/jquery-1.11.1.js',
                                            'public/javascripts/bootstrap.min.js',
                                            'public/javascripts/ie10-viewport-bug-workaround.js'],
                                        
                'public/javascripts/dashboard.min.js': ['public/javascripts/jquery-1.11.1.js',
                                            'public/javascripts/hideshow.js',
                                            'public/javascripts/jquery.tablesorter.min.js',
                                            'public/javascripts/jquery.equalHeight.js',
                                            'public/javascripts/jquery.dataTables.js',
                                            'public/javascripts/mystyles.js']                         
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
  
  grunt.registerTask("watchcss", ['watch:css']);
  grunt.registerTask("watchjs", ['watch:js']);
    
};
