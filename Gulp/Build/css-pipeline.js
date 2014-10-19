var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var gulpFilter = require('gulp-filter');
var less = require('gulp-less');
var sass = require('gulp-sass');
var rimraf = require('gulp-rimraf');

/* CSS Pipeline goals

Mostly same as JS pipeline goals
#1 2 bundles vendor.css for third-party libs and app.css for our code. Potentially navitaire.css/other
#2 Sourcemaps for debugging bundled files. And a task/mode that does NOT minify.
#3 Change-and-rebuild feedback to be small.
#5 Performance that comes with minification, and updates to be made possible through revisioning files
*/
var cssBuildOutput = conventions.cssBuildOutput();

var cssSources = conventions.appCss();

function commonPipeline() {
    var sassfilter = gulpFilter(['**/*.scss']);
    var lessfilter = gulpFilter(['**/*.less']);

    return gulp.src(cssSources)
        .pipe(sassfilter)
//      https://github.com/dlmanning/gulp-sass/issues/94
//      .pipe(sourcemaps.init())
        .pipe(sass())
//      .pipe(sourcemaps.write('.'))
        .pipe(sassfilter.restore())
        .pipe(lessfilter)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(lessfilter.restore())
        .pipe(concat("app.css"))
        .pipe(gulp.dest(cssBuildOutput.development));
}

gulp.task('css-pipeline', function() {
    return commonPipeline()
        .pipe(minifyCSS({ keepSpecialComments: 0 }))
        .pipe(rev())
        .pipe(gulp.dest(cssBuildOutput.production))
        .pipe(rev.manifest({ path: 'css-manifest.json' }))
        .pipe(gulp.dest(cssBuildOutput.production))
});

gulp.task('css-watch-task', function() {
    return commonPipeline();
});

// TODO: Watch CSS, watches only entry-points for less & sass. Look for better watches.
gulp.task('watch-css', function () {
    gulp.watch(cssSources, ['css-watch-task']);
});

gulp.task('clean-css', function () {
    return gulp.src(cssBuildOutput.development, { read: false })
        .pipe(rimraf({ force: true }));
});
