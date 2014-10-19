var runSequence = require('run-sequence');
/*
    Minify, bundle and revision CSS, JS for prod and dev
*/
gulp.task('assets', function (done) {
    runSequence('js-pipeline', 'vendor-js-pipeline', 'css-pipeline', done);
});

// TODO: Change name to assets build
gulp.task('js-build', function (done) {
    runSequence('js-tests', 'js-hints', 'css-lint', done);
});

gulp.task('assets-clean', function (done) {
    runSequence('clean-js', 'clean-css', done);
});
/*

Documentation for the devs - jira wiki points here.
Keeping this close to code, as it changes often.

gulp js-tests

    Compiles typescript, resolve-deps, uses jasmine 2.0
    Runs javascript tests in phantomjs firefox chrome and ie (configure in karma.conf)
    Code Coverage with istanbul
    reports in html for test results and coverage for Go

gulp watch-tests

    Same as gulp test
    Autoruns javascript tests when files change

gulp watch-js

    Autoruns js dev pipeline when source files change. Supports cached rebuilds.

*/
