var edge = require('edge');

gulp.task('remote-restart-iis', function () {
    return remoteRestart({ server:"localhost" }, function (error, result) {
        if (error) {
            gutil.log(gutil.colors.red("Error while executing PS snippet"));
            throw error;
        }
        if (result instanceof Array && result.length > 0)
        {
            result.forEach(function(value, index) {
                gutil.log(gutil.colors.green(value));
            });
            var exitCode = result[result.length - 1];
            if(exitCode != 0)
                throw new Error("remote-restart-iis non zero exit code : " + exitCode);
        }
    });
});


var remoteRestart = edge.func('ps', function () {/*
    . "../Powershell/IIS.ps1"
    Invoke-RemoteIisRestart ${inputFromJS}
*/
});

