var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;
var util = require('util');

var buildUtils = {
    pipingHandler: function(nextStep) {
        return function(error) {
            if (error) {
                throw error;
            } else if (nextStep && typeof nextStep == 'function') {
                return nextStep();
            }
            return nextStep;
        };
    },

    rmSync: function(file) {
        if (fs.exists(file)) {
            fs.unlinkSync(file);
        }
    },

    cleanRecreateFolder: function (folder, done) {
        rimraf(folder, util.pipingHandler(function () {
            mkdirp(folder, util.pipingHandler(done));
        }));
    },

    cleanRecreateFolderSync: function (folder) {
        rimraf.sync(folder);
        mkdirp(folder);
    },

    execute: function(command, argumentArray, closeHandler) {
        gutil.log(gutil.colors.green(util.format("Command : %s %j", command, argumentArray)));

        var child = spawn(command, argumentArray, {
            cwd: process.cwd,
            env: process.env
        });

        child.stderr.pipe(process.stderr);
        child.stdout.pipe(process.stdout);

        child.on('close', function (code) {
            console.log('child process exited with code ' + code);
            if (closeHandler) {
                closeHandler(code);
            }
        });

        return child;
    },

    unzip: function(source, destination, closeHandler) {
        var command = util.format("%s7z\\7za.exe", buildLibs);
        var arguments = ['x', source, '-aoa', '-o' + destination];
        this.execute(command, arguments, closeHandler);
    },

    zip: function(source, destination, closeHandler) {
        var command = util.format("%s7z\\7za.exe", buildLibs);
        var arguments = ['a', '-tzip', destination, source];
        this.execute(command, arguments, closeHandler);
    }
};

module.exports = buildUtils;
