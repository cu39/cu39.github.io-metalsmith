var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');

var msConf = require('./metalsmith.config.js');

gulp.task('default', ['build']);

gulp.task('build', ['metalsmith:build']);

gulp.task('metalsmith:build', ['metalsmith:clean'], function () {
  var ms = msConf.create('production');
  ms.build(function (err) { if (err) throw  err; });
});

gulp.task('metalsmith:clean', function () {
  return del([
      './build/**/*.html',
      '!./build/assets/**/*'
    ]);
});
