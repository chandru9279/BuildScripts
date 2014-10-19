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

gulp.task('deploy-web', function (done) {
    runSequence('get-web-artifact', 'copy-web', done);
});
    
gulp.task('deploy-assets', function (done) {
    runSequence('get-assets-artifact', 'copy-assets', done);
});

gulp.task('deploy', function (done) {
    runSequence('deploy-web', 'deploy-assets', done);
});

gulp.task('deploy-parallel', ['deploy-web', 'deploy-assets']);
