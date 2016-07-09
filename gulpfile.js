var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    runSequence = require('run-sequence'),
    browserify  = require('browserify'),
    connect     = require('gulp-connect');

gulp.task('clean', function () {
  return gulp.src('www').pipe(clean());
});

gulp.task('browserify', function () {
  var b = browserify({
    entries     : './src/index.js',
    cache       : {},
    packageCache: {}
  });

  var bundle = function () {
    return b.bundle()
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest('/www/js'));
  }.bind(this);

  b.on('update', bundle);
  return bundle;
});

gulp.task('move-lib', function () {
  return gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
    'node_modules/gl-matrix/dist/gl-matrix.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery/dist/jquery.min.map',
    'node_modules/three/src/math/Color.js'
  ]).pipe(gulp.dest('www/lib'));
});

gulp.task('move-data', function () {
  return gulp.src('data/**/*')
    .pipe(gulp.dest('www/data'));
});

gulp.task('move-src', function () {
  return gulp.src('src/**/*')
    .pipe(gulp.dest('www'));
});

gulp.task('start-server', function () {
  connect.server({root: 'www', port: 1337});
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*', 'data/**/*'], ['move-src', 'move-data']);
});

gulp.task('serve', ['watch'], function (callback) {
  runSequence('clean', 'move-src', 'move-data', 'move-lib', 'start-server', callback);
});