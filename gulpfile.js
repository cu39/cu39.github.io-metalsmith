var gulp = require('gulp');
var gutil = require('gulp-util');

var Metalsmith = require('metalsmith');

gulp.task('default', ['build']);

gulp.task('build', ['metalsmith:build']);

gulp.task('metalsmith:build', function () {
  var ms = new Metalsmith(__dirname);
  ms.build(function (err) { if (err) throw  err; });
});
