'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-build-control');

  grunt.initConfig({
    buildcontrol: {
      options: {
        dir: 'build',
        commit: true,
        tag: false,
        push: true
      },
      dist: {
        options: {
          remote: 'git@github.com:cu39/cu39.github.io.git',
          branch: 'master'
        }
      }
    }
  });

  grunt.registerTask('default', ['']);

};
