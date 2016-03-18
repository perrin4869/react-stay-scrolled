const gulp = require('gulp'),
	babel  = require('gulp-babel'),
	eslint = require('gulp-eslint');

gulp.task('lint', function() {
	return gulp.src(['lib/index.jsx'])
	.pipe(eslint())
	.pipe(eslint.format());
})

gulp.task('build', ['lint'], function() {
	gulp.src('lib/index.jsx')
	.pipe(babel())
	.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
