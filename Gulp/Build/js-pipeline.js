var gulpBrowserify = require('gulp-browserify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var debug = require('gulp-debug');
var rimraf = require('gulp-rimraf');
var size = require('gulp-filesize');

/* JS Pipeline goals
#1 we want performance with bundling - 2 bundles vendor.js for third-party libs and app.js for our code. Potentially more. (similar to what brunch offers)
#2 we want sourcemaps for debugging bundled files. And a task/mode that does NOT uglify.
#3 we want change-and-rebuild feedback to be small. (similar to what broccoli offers)
#4 we dont want to maintain an XML/JSON of bundle configs = list + order (similar to what we have in skysales)
#5 we want performance that comes with minification, and updates to be made possible through revisioning files
*/

gulp.task('js-pipeline', function () {
    var entrypoint = conventions.appJs()
    var jsBuildPaths = conventions.jsBuildOutput()
    return gulp.src(entrypoint)
        .pipe(gulpBrowserify({
        // Browserify handles #1 and #4 with CommonJS modules
            insertGlobals: false, // Enabling this sometimes inserts illegal characters in file.
            debug: true // will generate sourcemaps #2
        }))
        .pipe(gulp.dest(jsBuildPaths.development)) //#3
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(jsBuildPaths.production)) //#5
        .pipe(size())
        .pipe(rev.manifest({ path: 'js-manifest.json' }))
        .pipe(gulp.dest(jsBuildPaths.production));
});

// #3 watchify does cached-rebuilds - it offers what broccoli offers, with caching unchanged files
// Note this does not work well with sublime text save
gulp.task('watch-js-pipeline', function () {
    var entrypoint = conventions.appJs()
    var jsBuildPaths = conventions.jsBuildOutput()

    // { cache: {}, packageCache: {}, fullPaths: true } are mandatory when using watchify
    var b = browserify(entrypoint, {
        cache: {},
        packageCache: {},
        fullPaths: true,
        insertGlobals: false,
        debug: true
    });

    var w = watchify(b);

    w.on('update', function () {
        w.bundle()
            .pipe(source('app.js')) // convert text stream into vinyl file stream, filename is a mock file name
            .pipe(gulp.dest(jsBuildPaths.development))
    });

    w.on('bytes', function(bytes) {
        console.log("Bytes: " + bytes)
    })

    w.on('time', function(time) {
        console.log("Time: " + time)
    })

    w.on('log', function(msg) {
        console.log("Log: " + msg)
    })
});

gulp.task('clean-js', function () {
    var jsBuildPaths = conventions.jsBuildOutput()
    return gulp.src(jsBuildPaths.development, { read: false })
        .pipe(rimraf({ force: true }));
});
