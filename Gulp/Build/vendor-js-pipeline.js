var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var mainBowerFiles = require('main-bower-files');
var debug = require('gulp-debug');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var through = require('through');
var streamFromArray = require('stream-from-array');
var concat = require('gulp-concat');
var size = require('gulp-filesize');
var fs = require('fs');

/* Vendor pipeline goals.
#1 Use CDN to serve when possible. Some vendor files are not provided by popular CDNs. They should be served by us - minified.
#2 Have fallbacks provided by webserver in case CDN fails.
#3 Get the sequence from bower.
#4 Output a manifest file, with list of lineitems one per package
    { name, test-bundle, prod-bundle, cdn-url }
    test-bundle -> (with source maps) is a processed file for use in tests, and development.
    prod-bundle -> (reved and minified) is the fallback, if cdn-url fails.
    Order of list is is dictated by bower.
*/
var bowerComponents = conventions.bowerPath() + 'bower_components';
var bowerJson = conventions.bowerPath() + 'bower.json';
var vendorPath = conventions.vendorPath();

var orderedPackages = [];
var packagesMap = {};
var manifests = [];

// In case of dependent bower packages, this takes care of ordering the main files correctly.
// https://github.com/ck86/main-bower-files
var mainFiles = mainBowerFiles({
    checkExistence: true,
    main: "dist/**/*.*",
    env: 'bundlejs',
    // debugging: true,
    paths: {
        bowerDirectory: vendorPath,
        bowerJson: vendorPath + 'bower.json'
    }
});

// TODO: Hybrid per package & Across package bundling

gulp.task('vendor-js-pipeline', function (done) {
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
    var packageName = orderedPackages[packageIndex];
    console.log(packageName + " : " + packagesMap[packageName].length);
    streamFromArray.obj(packagesMap[packageName])
        // .pipe(debug({ verbose: false }))
        .pipe(sourcemaps.init({ loadMaps: true })) // This loads vendor source maps, like jquery.min.map when loading jquery.min.js
        .pipe(concat(packageName + ".js"))
        // This merges our concat map on top vendor map, so we go from concatenated, minified files to source (vendor-<hash>.js -> jquery.js) Noice :)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(conventions.jsBuildOutput().development))
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(conventions.jsBuildOutput().production))
        .pipe(size())
        .pipe(rev.manifest())
        .pipe(through(function(file) {
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
                var vendorJsManifestJson = "vendor-js-manifest.json";
                var manifestJson = JSON.stringify(manifests, null, 4);
                fs.writeFileSync(conventions.jsBuildOutput().development + vendorJsManifestJson, manifestJson);
                fs.writeFileSync(conventions.jsBuildOutput().production + vendorJsManifestJson, manifestJson);
                return done();
            }
            bundleEachPackage(nextPackage, done);
        });
}


gulp.task('vendor-js-for-tests', function (done) {
    return gulp.src(mainFiles, { base: vendorPath })
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat("vendor-for-tests.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(conventions.jsBuildOutput().development))
        .pipe(size());
});
