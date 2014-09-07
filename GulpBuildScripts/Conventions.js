var env = require('./Environments/dev.json');

module.exports = {
    solutionPath: function () {
        return env.repoPath + "Source/";
    },    
    buildPath: function () {
        return env.repoPath + "Build/";
    },
    webPath: function () {
        return this.solutionPath() + "Web/";
    },
    solutionFile: function () {
        return this.solutionPath() + "Jetstar-DotRez.sln";
    },
    webProjectFile: function () {
        return this.webPath() + "Web.csproj";
    }
}