var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var gulpFilter = require('gulp-filter');
var less = require('gulp-less');
var sass = require('gulp-sass');
var mainBowerFiles = require('main-bower-files');
var size = require('gulp-filesize');
var through = require('through');
var path = require('path');
var streamFromArray = require('stream-from-array');
var fs = require('fs');

/* Vendor CSS Pipeline goals 
#1 All the Vendor JS pipeline goals
#2 Allow custom builds for packages, that allow customization (Foundation sass fileset)
*/
var cssBuildOutput = conventions.cssBuildOutput();

var bowerComponents = conventions.bowerPath() + 'bower_components';
var bowerJson = conventions.bowerPath() + 'bower.json';
var vendorPath = conventions.vendorPath();

var orderedPackages = [];
var packagesMap = {};
var manifests = [];

// TODO: Per package bundling

var mainFiles = mainBowerFiles({
    checkExistence: true,
    main: "dist/**/*.*",
    env: 'bundleStyles',
    // debugging: true,
    paths: {
        bowerDirectory: vendorPath,
        bowerJson: vendorPath + 'bower.json'
    }
});

gulp.task('vendor-css-pipeline', function (done) {

    gulp.src(mainFiles, { base: vendorPath })
    .pipe(through(function (file) {
        console.log(file.path)
        var packageName = path.normalize(file.path).match(/\\Web\\Vendor\\([.a-z0-9-]*)\\/).slice(1)[0]; // https://github.com/bower/bower.json-spec#name - regex rules
        if (orderedPackages.indexOf(packageName) == -1) {
            orderedPackages.push(packageName);
            packagesMap[packageName] = [];
        }
        packagesMap[packageName].push(file);
    }))
    .on('end', function () {
        bundleEachPackage(0, done);
    });

});

function bundleEachPackage(packageIndex, done) {

    var sassfilter = gulpFilter(['**/*.scss']);
    var lessfilter = gulpFilter(['**/*.less']);

    var packageName = orderedPackages[packageIndex];
    console.log(packageName + " : " + packagesMap[packageName].length);
    streamFromArray.obj(packagesMap[packageName])
        .pipe(sassfilter)
        .pipe(sass())
        .pipe(sassfilter.restore())
        .pipe(lessfilter)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(lessfilter.restore())
        .pipe(concat(packageName + ".css"))
        .pipe(gulp.dest(cssBuildOutput.development))
        .pipe(minifyCSS({ keepSpecialComments: 0 }))
        .pipe(rev())
        .pipe(gulp.dest(cssBuildOutput.production))
        .pipe(size())
        .pipe(rev.manifest())
        .pipe(through(function (file) {
            var manifest = JSON.parse(file.contents.toString());
            var testBundle = Object.keys(manifest)[0];
            var prodBundle = manifest[testBundle];
            manifests.push({
                Package: packageName,
                TestBundle: testBundle,
                ProdBundle: prodBundle,
                CdnUrl: "<placeholder>" // TODO
            });
        }))
        .on("end", function () {
            var nextPackage = packageIndex + 1;
            if (orderedPackages.length === nextPackage) {
                var vendorCssManifestJson = "vendor-css-manifest.json";
                var manifestJson = JSON.stringify(manifests, null, 4);
                fs.writeFileSync(conventions.cssBuildOutput().development + vendorCssManifestJson, manifestJson);
                fs.writeFileSync(conventions.cssBuildOutput().production + vendorCssManifestJson, manifestJson);
                return done();
            }
            bundleEachPackage(nextPackage, done);
        });
}
