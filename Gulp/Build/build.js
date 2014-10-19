var msbuild = require('gulp-msbuild');
var zip = require('gulp-zip');
var merge = require('merge-stream');
var util = require('./Functions/util.js');

gulp.task("clean", function (done) {
    //remove trailing slash
    var buildFolder = conventions.buildPath().substring(0, conventions.buildPath().length - 1); 
    util.cleanRecreateFolder(buildFolder, done);
});

gulp.task("msbuild", function () {
    var buildOptions = {
        stdout: true,
        stderr: true,
        targets: ['Clean', 'Build'],
        toolsVersion: 4.0,
        properties: {
            Configuration: 'Release',
            OutDir: conventions.buildPath() + "Web"
        },
        errorOnFail: true
    };
    console.log(conventions.webProjectFile());
    var stream = gulp.src(conventions.webProjectFile())
        .pipe(msbuild(buildOptions));
    return stream;
});


gulp.task("zip", function () {
    var artifacts = conventions.artifacts();
    var artifactZipStreams = [];
    for (var index in artifacts) {
        var artifact = artifacts[index];
        gutil.log(gutil.colors.yellow("Zipping artifact : " + artifact.name));
        var zipStream = gulp.src(artifact.source)
            .pipe(zip(artifact.fileName))
            .pipe(gulp.dest(artifact.path));
        artifactZipStreams.push(zipStream);
    }
    return merge.apply(this, artifactZipStreams);
});