var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

var msConf = require('./metalsmith.config.js');

gulp.task('default', ['build']);

gulp.task('build', [
  'webpack:build',
  'metalsmith:build'
]);

gulp.task('webpack:build', ['webpack:clean'], function () {
  webpack(webpackConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack] Stats:\n" + stats.toString());
  });
});

gulp.task('webpack:clean', function () {
  return del([
      './build/assets/bundle.js'
    ]);
});

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
