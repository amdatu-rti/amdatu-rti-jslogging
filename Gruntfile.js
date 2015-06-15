"use strict";

module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-shell');

    // Project configuration.
    grunt.initConfig({

        typescript: {
            base: {
                src: ['*.ts'],
                dest: '.',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: '.',
                    sourceMap: true,
                    declaration: false
                }
            }
        },

        watch: {
            base: {
                files: '*.ts',
                tasks: ['shell:clrscr', 'typescript:base']
            }
        },

        shell: {
            clrscr: {
                options: {
                    stdout: true
                },
                command: 'clear screen'
            }
        }
    });

    grunt.registerTask("default", ["typescript:base"]);
    grunt.registerTask("dev", ["typescript:base", "watch"]);
};
