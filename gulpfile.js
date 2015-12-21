var gulp = require('gulp');
var gutil = require('gulp-util');

var msConf = require('./metalsmith.config.js');

gulp.task('default', ['build']);

gulp.task('build', ['metalsmith:build']);

gulp.task('metalsmith:build', function () {
  var ms = msConf.create('production');
  ms.build(function (err) { if (err) throw  err; });
});
