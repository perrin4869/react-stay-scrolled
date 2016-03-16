const gulp = require('gulp'),
	babel  = require('gulp-babel');

gulp.task('build', function() {
	gulp.src('lib/index.jsx')
	.pipe(babel())
	.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
