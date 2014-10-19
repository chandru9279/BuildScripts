var spawn = require('child_process').spawn;
var roboexit = require('./robocopy-exitcodes.js');
var util = require('util');
var buildUtils = require('../../Build/Functions/util.js');

module.exports = {
    
    copyToWebservers: function (source, webserverPath, done) {
        var webServersDeployed = [];
        
        for (var index in env.webservers) {
            var ws = env.webservers[index];
            var command = util.format("%srobocopy\\robocopy.exe", buildLibs);
            gutil.log(gutil.colors.green(util.format("Copying to %s, path %s", ws.name, ws[webserverPath])));
            
            var robocopyExitHandler = function (code) {
                if (code >= 8)
                    throw new Error(roboexit[error.code] || ("Files were not copied, exit code > 8 : " + error.code));
                else
                    gutil.log(gutil.colors.green(roboexit[code]));
                
                webServersDeployed.push(ws.name);
                if (webServersDeployed.length === env.webservers.length) done();
            };

            buildUtils.execute(
                command,
                [source, ws[webserverPath], '/v', '/e', '/purge', '/mir'],
                robocopyExitHandler
);
        }
    }
};