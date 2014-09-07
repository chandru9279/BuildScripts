var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var msbuild = require('gulp-msbuild');
var conventions = require('./Conventions.js');

gulp.task('default', ['minify-css']);

gulp.task('minify-css', function () {
    return gulp.src(conventions.webPath() + 'Content/*.css')
    .pipe(minifyCSS({keepSpecialComments :0}))
    .pipe(concat("css-combined.min.css"))
    .pipe(rev())
    .pipe(gulp.dest(conventions.buildPath()));
});

gulp.task("build", function () {
    console.log(conventions.webProjectFile());
    gulp.src(conventions.webProjectFile())
        .pipe(msbuild({
//            msbuildPath: "\"c:/Program Files (x86)/MSBuild/12.0/Bin/MSBuild.exe\"",
//            msbuildPath: "\"C:/Windows/Microsoft.NET/Framework64/v4.0.30319/MSBuild.exe\"",
            stdout: true,
            stderr: true,
            targets: ['Clean', 'Build', '_CopyWebApplication'],
            toolsVersion: 4.0,
            properties: {
                Configuration: 'Release', 
                VisualStudioVersion: '10.0', 
                WebProjectOutputDir: conventions.buildPath() + "Web/",
                OutputPath: conventions.buildPath() + "Web/",
                OutDir: conventions.buildPath() + "Web/"
            }
        }));
});
