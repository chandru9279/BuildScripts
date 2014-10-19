var karma = require('gulp-karma');
var debug = require('gulp-debug');

gulp.task('js-tests', ['vendor-js-for-tests'], function () {
    return gulp.src(conventions.jsTestGlobals(), {read: false})
        // .pipe(debug({ verbose: false })) // Add this line to see what's being included
        .pipe(karma({
            configFile: conventions.karmaConfig(),
            action: 'run'
        }))
        .on('error', function (err) {
            throw err; // failed tests cause gulp to exit non-zero
        });
});

gulp.task('watch-js-tests', ['vendor-js-for-tests'], function () {
    return gulp.src(conventions.jsTestGlobals(), { read: false })
      .pipe(karma({
          configFile: conventions.karmaConfig(),
          action: 'watch'
      }));
});