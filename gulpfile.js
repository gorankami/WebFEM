var gulp    = require('gulp'),
    clean   = require('gulp-clean'),
    connect = require('gulp-connect');

gulp.task('clean', function () {
  return gulp.src('www').pipe(clean());
});

gulp.task('move-all', ['clean'], function () {
  return gulp.src('src/*')
    .pipe(gulp.dest('www'));
});

gulp.task('serve', ['move-all'], function () {
  connect.server({root: 'src', port: 1337});
});