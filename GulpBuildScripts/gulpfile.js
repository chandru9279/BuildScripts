var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var msbuild = require('gulp-msbuild');
var xtend = require('xtend');
var conventions = require('./Conventions.js');

gulp.task('default', ['minify-css']);

gulp.task('minify-css', function () {
    return gulp.src(conventions.webPath() + 'Content/*.css')
    .pipe(minifyCSS({keepSpecialComments :0}))
    .pipe(concat("css-combined.min.css"))
    .pipe(rev())
    .pipe(gulp.dest(conventions.buildPath()));
});

gulp.task("build", function() {
    var buildOptions = {
        stdout: true,
        stderr: true,
        targets: ['Clean', 'Build'],
        toolsVersion: 4.0,
        properties: {
            Configuration: 'Release',
            OutDir: conventions.buildPath() + "Web"
        }
    };

    console.log("Build and Clean: %j", buildOptions);

    gulp.src(conventions.webProjectFile())
        .pipe(msbuild(buildOptions));
});

/* TODO:

Build Tasks 

	* Clean
	* Zip

Deployment Tasks 

	* To copy to shared folder of target webserver 
	* RestartAppPool 
	* Environment specific variables - deploy time.

*/
