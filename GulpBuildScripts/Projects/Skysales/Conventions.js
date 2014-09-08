// TODO: Pick up the environment file to include based on command line env parameter

var env = require('./Environments/dev.json');
var xtend = require('xtend');

if (env.extend) {
    var extension = require('./Environments/' + env.extend + '.json');
    env = xtend(env, extension);
}

module.exports = {
    solutionPath: function() {
        return env.repoPath;
    },
    buildPath: function() {
        return env.repoPath + "build/";
    },
    webPath: function() {
        return env.repoPath + "Website/";
    },
    solutionFile: function() {
        return env.repoPath + "SkySalesSolution.sln";
    },
    webProjectFile: function() {
        throw new Error("No web project file in Skysales");
    }
}