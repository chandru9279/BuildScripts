// TODO: Pick up the environment file to include based on command line env parameter

var env = require('./Environments/dev.json');
var xtend = require('xtend');

if (env.extend) {
    var extension = require('./Environments/' + env.extend);
    env = xtend(env, extension);
}

module.exports = {
    solutionPath: function() {
        return env.repoPath + "Source/";
    },
    buildPath: function() {
        return env.repoPath + "Build/";
    },
    webPath: function() {
        return this.solutionPath() + "Web/";
    },
    solutionFile: function() {
        return this.solutionPath() + "Jetstar-DotRez.sln";
    },
    webProjectFile: function() {
        return this.webPath() + "Web.csproj";
    }
}