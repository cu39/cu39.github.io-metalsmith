'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-build-control');

  grunt.initConfig({
    buildcontrol: {
      options: {
        dir: 'build',
        commit: true,
        tag: false,
        push: false
      },
      dist: {
        options: {
          branch: 'master'
        }
      }
    }
  });

  grunt.registerTask('default', ['']);

};
