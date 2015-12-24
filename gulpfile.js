var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');

var msConf = require('./metalsmith.config.js');

gulp.task('default', ['serve']);

gulp.task('serve', ['build', 'webserver', 'watch']);

gulp.task('build', ['sass:build', 'webpack:build', 'metalsmith:build']);

// Webpack

gulp.task('webpack:clean', function () {
  return del([
      './build/assets/bundle.js'
    ]);
});

gulp.task('webpack:build', ['webpack:clean'], function () {
  webpack(webpackConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack] Stats:\n" + stats.toString());
  });
});

// Sass

gulp.task('css:clean', function () {
  return del([
      './build/assets/style.css'
    ]);
});

gulp.task('sass:build', ['css:clean'], function () {
  gulp.src('./src/assets/sass/**/*.s[ac]ss')
    .pipe(sass({
      'outputStyle': 'nested'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./.tmp/css'))
    .on('end', function () {
      gulp.src('./.tmp/css/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./build/assets'))
        .on('end', function () {
          del(['./.tmp/']);
        });
    });
});

// Metalsmith

gulp.task('metalsmith:clean', function () {
  return del([
      './build/**/*.html',
      '!./build/assets/**/*'
    ]);
});

gulp.task('metalsmith:build', ['metalsmith:clean'], function () {
  var ms = msConf.create('production');
  ms.build(function (err) { if (err) throw  err; });
});

// Webserver

gulp.task('webserver', function (callback) {
  gulp.src('./build')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

// Watch

gulp.task('watch', function (callback) {
  gulp.watch('src/assets/js/**/*.js', ['webpack:build']);
  gulp.watch('src/assets/sass/**/*', ['sass:build']);
  gulp.watch(
    ['src/**/*.html', 'src/**/*.md', 'layouts/**/*.jade'],
    ['webpack:build', 'sass:build', 'metalsmith:build']
  );
});
