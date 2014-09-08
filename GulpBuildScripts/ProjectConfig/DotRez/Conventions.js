var env = require('./Environments/dev.json');

module.exports = {
    solutionPath: function () {
        return env.repoPath + "Source/";
    },    
    buildPath: function () {
        return env.repoPath + "NewCssMinified/";
    },
    webPath: function () {
        return env.repoPath +"Website/";
    },
    solutionFile: function () {
        return env.repoPath + "SkySalesSolution.sln";
    },
    webProjectFile: function () {
        return env.repoPath +"Website/" + "Web.csproj";
    }
}