const sass = require('node-sass')
module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            files: './sass/*.scss',
            tasks: ['css']
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dev: {
                files: {
                    './css/main.css': './sass/main.scss'
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')
                ]
            },
            dist: {
                src: 'css/*.css'
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        './css/*.css',
                        '**/**.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './'
                }
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    // define default task
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('css', ['sass', 'postcss']);
};