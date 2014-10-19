var util = require('util');
var _ = require('underscore');
var download = require("gulp-download");
var unzip = require("gulp-unzip");
var robocopy = require("./Functions/robocopy.js");
var buildUtils = require("../Build/Functions/util.js");

gulp.task("copy-web", function (done) {
    var source = artifactExtractPath("Web");
    var webserverPath = "websitePath"; // Refers to the websitePath property in webserver object in <env>.json
    robocopy.copyToWebservers(source, webserverPath, done);
});

gulp.task("copy-assets", function (done) {
    var source = artifactExtractPath("Assets");
    var webserverPath = "assetsPath"; // Refers to the asssetsPath property in webserver object in <env>.json
    robocopy.copyToWebservers(source, webserverPath, done);
});

gulp.task("get-assets-artifact", function (done) {
    var path = artifactExtractPath("Assets");
    gutil.log(gutil.colors.yellow(util.format("Cleaning extract paths : %s", path)));
    buildUtils.cleanRecreateFolderSync(path);
    downloadExtractArtifact("Assets", done);
});

gulp.task("get-web-artifact", function (done) {
    var path = artifactExtractPath("Web");
    gutil.log(gutil.colors.yellow(util.format("Cleaning extract paths : %s", path)));
    buildUtils.cleanRecreateFolderSync(path);
    downloadExtractArtifact("Web", done);
});

function downloadExtractArtifact(artifactName, done) {
    // artifactName should match the name of an artifact in Conventions 
    var assetArtifact = _.find(conventions.artifacts(), function(a) { return a.name === artifactName; });
    var url = conventions.artifactsDownloadUrl() + assetArtifact.fileName;
    gutil.log(gutil.colors.yellow(util.format("Download URL : %s", url)));
    
    var remoteRestart = function () {

        done();
    }

    var unzipAfterDownload = function () {
        buildUtils.unzip(
            artifactDownloadPath() + assetArtifact.fileName,
            artifactExtractPath(artifactName),
            remoteRestart);
    };

    return download(url)
        .pipe(gulp.dest(artifactDownloadPath()))
        .on('end', unzipAfterDownload);
}

function artifactExtractPath(artifactName) {
    return conventions.buildPath() + "Deploy/" + artifactName;
}

function artifactDownloadPath() {
    return conventions.buildPath() + "Deploy/";
}