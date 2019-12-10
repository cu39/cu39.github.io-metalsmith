var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var log = require('fancy-log');
var PluginError = require('plugin-error');
var del = require('del');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');

var msConf = require('./metalsmith.config.js');

// Copy assets

gulp.task('bootstrap:fonts', function (done) {
  gulp.src('./node_modules/bootstrap-sass/assets/fonts/**/*')
    .pipe(gulp.dest('./build/assets/fonts'))
    .pipe(gulp.dest('./.tmp/assets/fonts'));
  done();
});

gulp.task('copy', gulp.parallel('bootstrap:fonts'));

// Webpack

gulp.task('webpack:clean', function (done) {
  return del([
    './{build,.tmp}/assets/bundle.js'
  ]);
  done();
});

gulp.task('webpack:build', gulp.series(
  'webpack:clean',
  function (done) {
    var buildConfig = Object.assign({}, webpackConfig);
    buildConfig.mode = 'production';
    buildConfig.output.path = path.join(__dirname, 'build', 'assets');
    webpack(buildConfig, function (err, stats) {
      if (err) throw new PluginError("webpack", err);
      log.error("[webpack] Stats:\n" + stats.toString({ colors: true }));
    });
    done();
  })
);

gulp.task('webpack:build-dev', gulp.series(
  'webpack:clean',
  function (done) {
    var buildConfig = Object.assign({}, webpackConfig);
    buildConfig.mode = 'development';
    buildConfig.output.path = path.join(__dirname, '.tmp', 'assets');
    webpack(buildConfig, function (err, stats) {
      if (err) throw new PluginError("webpack", err);
      log.error("[webpack] Stats:\n" + stats.toString({ colors: true }));
    });
    connect.reload();
    done();
  })
);

// Sass

gulp.task('css:clean', function (done) {
  return del([
    './{build,.tmp}/assets/style.css'
  ]);
});

gulp.task('sass:build', gulp.series(
  'css:clean',
  function (done) {
    gulp.src('./src/assets/sass/main.scss')
      .pipe(sass({
        'outputStyle': 'compressed'
      }).on('error', sass.logError))
      .pipe(rename('style.css'))
      .pipe(gulp.dest('./build/assets'));
    done();
  })
);

gulp.task('sass:build-dev', gulp.series(
  'css:clean',
  function (done) {
    gulp.src('./src/assets/sass/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        'outputStyle': 'nested'
      }).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(rename('style.css'))
      .pipe(gulp.dest('./.tmp/assets'))
      .pipe(connect.reload());
    done();
  })
);

// Metalsmith

gulp.task('metalsmith:clean', function () {
  return del([
    './{build,.tmp}/**/*.html',
    '!./{build,.tmp}/assets/**/*'
  ]);
});

gulp.task('metalsmith:build', gulp.series(
  'metalsmith:clean',
  function (done) {
    var ms = msConf.create('production');
    ms.build(function (err) { if (err) throw  err; });
    done();
  })
);

gulp.task('metalsmith:build-dev', gulp.series(
  'metalsmith:clean',
  function (done) {
    var ms = msConf.create('development');
    ms.build(function (err) { if (err) throw  err; });
    done();
  })
);

// Webserver

gulp.task('webserver', function (done) {
  connect.server({
    root: '.tmp',
    livereload: true,
  });
  done();
});

function reload() {
  return gulp.src('src/**/*').pipe(connect.reload());
}

// Watch

gulp.task('watch', function (callback) {
  gulp.watch(
    [
      'src/assets/index.js',
      'src/assets/js/**/*.js',
    ],
    gulp.series(
      'webpack:build-dev',
      reload
    )
  );
  gulp.watch(
    'src/assets/sass/**/*',
    gulp.task('sass:build-dev')
  );
  gulp.watch(
    [
      'src/**/*.html',
      'src/**/*.{md,pug}',
      'layouts/**/*.pug'
    ],
    gulp.series(
      'webpack:build-dev',
      'metalsmith:build-dev',
      reload
    )
  );
});

gulp.task('build', gulp.series(
  'copy',
  'sass:build',
  'webpack:build',
  'metalsmith:build'
));

gulp.task('build-dev', gulp.series(
  'copy',
  'sass:build-dev',
  'webpack:build-dev',
  'metalsmith:build-dev'
));

gulp.task('serve', gulp.parallel(
  gulp.series('build-dev', 'webserver'),
  'watch'
));

gulp.task('default', gulp.parallel('serve'));
