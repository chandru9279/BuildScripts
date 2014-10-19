"use strict";

var csslint = require('gulp-csslint');
var gulpFilter = require('gulp-filter');
var sass = require('gulp-sass')
var csslintreport = require('../Libs/csslint-report.js');

// https://github.com/CSSLint/csslint/wiki/Rules-by-ID
// Right now this swamps the logs, so not marked this as artifact in Go

var lintOptions = {
    //    'shorthand': false
};

var reportOpt = {
    "filename": 'csslint-report.html',
    "directory": conventions.buildPath() + 'Artifacts/CssLint/'
};

gulp.task('css-lint', function () {
    var filter = gulpFilter(['**/*.scss']);

    // TODO: Can we use streamqueue to concatenate all the lint output files together?
    return gulp.src(conventions.appCss())
        .pipe(filter)
        .pipe(sass())
        .pipe(filter.restore())
        .pipe(csslint(lintOptions))
        .pipe(csslintreport(reportOpt));
});