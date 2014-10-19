var mainBowerFiles = require('main-bower-files');
var debug = require('gulp-debug');
var changedfiles = require('gulp-changed-files');
var streamqueue = require('streamqueue');
var ignore = require('gulp-ignore');
var argv = require('yargs').argv;
var path = require('path');


var bowerComponents = conventions.bowerPath() + 'bower_components';
var bowerJson = conventions.bowerPath() + 'bower.json';
var vendorPath = conventions.vendorPath();

// bower maintains record of all front end frameworks in bower.json along with dependencies.
// It helps keep only one version of given framework, in project is we use it exclusively for front end frameworks.
gulp.task('bower-cherry-pick', ['copy-main-bower'], function () {
    if (!argv.package)
        throw "Choose the package to cherry-pick. Example : \'gulp bower-cherry-pick --package jquery\'"
    // In case of dependent bower packages, this takes care of ordering the main files correctly.
    // Prevents bower bloat.
    // https://github.com/ck86/main-bower-files
    var commitFiles = mainBowerFiles({
        checkExistence: false,
        main: "dist/**/*.*",
        env: 'commit',
        // debugging: true,
        paths: {
            bowerDirectory: bowerComponents,
            bowerJson: bowerJson
        }
    });
    var packageSpecificFiles = path.join(bowerComponents, argv.package, '/**/*.*');
    console.log(packageSpecificFiles);
    return streamqueue(
        { objectMode: true },
        gulp.src(commitFiles, { base: bowerComponents })
        .pipe(ignore.include(packageSpecificFiles)),
        //Add bower.json & .bower.json when committing
        gulp.src([
            path.join(bowerComponents, argv.package, 'bower.json'),
            path.join(bowerComponents, argv.package, '.bower.json')
        ], { base: bowerComponents })
        )
        .pipe(changedfiles({
            debug: true,
            baseDir: path.join(bowerComponents, argv.package),
            targetDir: path.join(vendorPath, argv.package)
        }))
        // .pipe(debug({ verbose: false }))
        .pipe(gulp.dest(vendorPath));
});

gulp.task('copy-main-bower', function () {
    return gulp.src(bowerJson)
        .pipe(changedfiles({
            debug: true,
            baseDir: conventions.bowerPath(),
            targetDir: vendorPath
        }))
        .pipe(gulp.dest(vendorPath));
});