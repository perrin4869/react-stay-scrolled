const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const Server = require('karma').Server;

const src = 'src/*.js';

gulp.task('lint', () => (
  gulp.src(src)
  .pipe(eslint())
  .pipe(eslint.format())
));

gulp.task('test', ['lint'], (done) => {
  new Server({
    configFile: path.join(__dirname, '/karma.conf.js'),
    singleRun: true,
    autoWatch: false,
  }, done).start();
});

gulp.task('tdd', (done) => {
  new Server({
    configFile: path.join(__dirname, '/karma.conf.js'),
  }, done).start();
});

gulp.task('build', ['test'], () => (
  gulp.src(src)
  .pipe(babel())
  .pipe(gulp.dest('lib'))
));

gulp.task('default', ['build']);
