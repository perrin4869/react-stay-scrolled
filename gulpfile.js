const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

gulp.task('lint', () => (
  gulp.src(['lib/index.jsx'])
  .pipe(eslint())
  .pipe(eslint.format())
));

gulp.task('build', ['lint'], () => (
  gulp.src('lib/index.jsx')
  .pipe(babel())
  .pipe(gulp.dest('dist'))
));

gulp.task('default', ['build']);
