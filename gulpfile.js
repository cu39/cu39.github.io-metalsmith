var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var del = require('del');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');

var hbs = require('handlebars');
var moment = require('moment');

hbs.registerHelper('dateFormat', function(date) {
  return moment(date).format("MMM D, YYYY");
});

var msConf = require('./metalsmith.config.js');

gulp.task('default', ['serve']);

gulp.task('build', ['copy', 'sass:build', 'webpack:build', 'metalsmith:build']);

gulp.task('build-dev', ['copy', 'sass:build-dev', 'webpack:build-dev', 'metalsmith:build-dev']);

gulp.task('serve', ['build-dev', 'webserver', 'watch']);

// Copy assets

gulp.task('copy', ['bootstrap:fonts']);

gulp.task('bootstrap:fonts', function () {
  gulp.src('./node_modules/bootstrap-sass/assets/fonts/**/*')
    .pipe(gulp.dest('./build/assets/fonts'));
});

// Webpack

gulp.task('webpack:clean', function () {
  return del([
      './build/assets/bundle.js'
    ]);
});

gulp.task('webpack:build', ['webpack:clean'], function () {
  var buildConfig = Object.create(webpackConfig);
  buildConfig.plugins = buildConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );
  webpack(buildConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack] Stats:\n" + stats.toString({ colors: true }));
  });
});

gulp.task('webpack:build-dev', ['webpack:clean'], function () {
  webpack(webpackConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack] Stats:\n" + stats.toString({ colors: true }));
  });
});

// Sass

gulp.task('css:clean', function () {
  return del([
      './build/assets/style.css'
    ]);
});

gulp.task('sass:build', ['css:clean'], function () {
  gulp.src('./src/assets/sass/main.scss')
    .pipe(sass({
      'outputStyle': 'compressed'
    }).on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('sass:build-dev', ['css:clean'], function () {
  gulp.src('./src/assets/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      'outputStyle': 'nested'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./build/assets'));
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

gulp.task('metalsmith:build-dev', ['metalsmith:clean'], function () {
  var ms = msConf.create('development');
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
    ['src/**/*.html', 'src/**/*.{md,jade}', 'layouts/**/*.jade'],
    ['webpack:build', 'sass:build', 'metalsmith:build']
  );
});
