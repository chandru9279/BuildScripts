var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var env = require('./Environments/dev.json');

gulp.task('default', ['minify-css']);

gulp.task('minify-css', function () {
    return gulp.src(env.solutionPath + '/Content/*.css')
    .pipe(minifyCSS({keepSpecialComments :0}))
    .pipe(concat("css-combined.min.css"))
    .pipe(rev())
    .pipe(gulp.dest(env.solutionPath + 'Out/'));
});