var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var mkdirp = require('mkdirp');

gulp.task('js-hints', function () {
    var sourceToLint = conventions.jsCodeQualityFilter();
    var jsLintOutputDir = conventions.buildPath() + 'Artifacts/JsHint/';
    mkdirp(jsLintOutputDir);
    return gulp.src(sourceToLint)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('gulp-jshint-html-reporter', {
            filename: jsLintOutputDir + 'jshint-report.html'
        }));
    // .pipe(jshint.reporter('fail')); // Uncomment to fail build on missing semicolons
});

// Doesn't seem to have a pretty output or a proper reporter
gulp.task('js-styling', function () {
    var sourcesToCheckStyles = conventions.jsCodeQualityFilter();
    return gulp.src(sourcesToCheckStyles)
        .pipe(jscs(conventions.buildConfigsPath() + 'jscs.json'));
});