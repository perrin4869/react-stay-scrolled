const gulp = require('gulp');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const webserver = require('gulp-webserver');

const Builder = require('jspm').Builder;

gulp.task('lint', () => (
  gulp.src(['src/*.jsx'])
  .pipe(eslint())
  .pipe(eslint.format())
));

gulp.task('build', ['lint'], () => {
  const builder = new Builder();

  return builder.bundle('react-stay-scrolled-demo', 'lib/react-stay-scrolled-demo.js', {
    sourceMaps: true,
    minify: true,
    mangle: true,
  })
  .catch(err => gutil.log(err));
});

gulp.task('watch', () => {
  gulp.watch('src/*.jsx', ['build']);
});

gulp.task('develop', ['watch'], () => {
  gulp.src('.')
  .pipe(webserver({
    port: 5000,
    livereload: true,
    open: true,
  }));
});

gulp.task('default', ['build']);
