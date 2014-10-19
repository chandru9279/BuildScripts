var util = require('util');

module.exports = {

    // Paths

    solutionPath: function () {
        return env.repoPath + "Source/";
    },
    buildPath: function () {
        return env.repoPath + "Build/";
    },
    buildConfigsPath: function () {
        return env.repoPath + "BuildConfigs/";
    },
    buildWebPath: function(){
        return this.buildPath() + "Web/_PublishedWebsites/Web/";
    },
    webPath: function() {
        return this.solutionPath() + "Web/";
    },
    vendorPath: function () {
        return this.webPath() + "Vendor/";
    },
    bowerPath: function () {
        return env.repoPath + "Libs/";
    },    
    solutionFile: function() {
        return this.solutionPath() + "Test-App.sln";
    },
    webProjectFile: function() {
        return this.webPath() + "Web.csproj";
    },    

    // Entry points for asset build

    appCss: function () {
        return [
            this.solutionPath() + 'Web/Content/**/*.css',
            this.solutionPath() + 'Web/Content/**/*.scss',
            this.solutionPath() + 'Web/Content/less/main.less',
            '!' + this.solutionPath() + 'Web/Content/Generated/**'
        ]
    },
    appJs: function () {
        return [
            this.solutionPath() + "Web/Scripts/Bundles/app.js"
        ];
    },

    // Asset build output folders

    cssBuildOutput: function () {
        return {
            development: this.webPath() + "Content/Generated/",
            production: this.buildWebPath() + "Content/Generated/"
        };
    },
    jsBuildOutput: function () {
        return {
            development: this.webPath() + "Scripts/Bundles/Generated/",
            production: this.buildWebPath() + "Scripts/Bundles/Generated/",
        };
    },

    // Testing

    jsTestGlobals: function () {
        // We do not need to include the sources, browserify will load it for the tests
        return [
            this.jsBuildOutput().development + "vendor-for-tests.js",
            this.solutionPath() + 'Web.JasmineTests/**/*.js'
        ];
    },
    karmaConfig: function() {
        return this.buildConfigsPath() + "karma.conf.js";
    },
    jsCodeQualityFilter: function () {
        return [
            this.solutionPath() + "Web/Scripts/DataLayer/**/*.js"
        ];
    },

    // Deploy

    artifacts: function () {
        // Name of the artifact decides how it is deployed. TODO: Find better way
        return [
            {
                "name": "Web",
                "path": this.buildPath(),
                "fileName": "Web.zip",
                "source": this.buildPath() + 'Web/_PublishedWebsites/Web/**'
            },
            {
                "name": "Assets",
                "path": this.buildPath(),
                "fileName": "Assets.zip",
                "source": this.buildPath() + 'Assets/**'
            }
        ];
    },
    artifactsDownloadUrl: function() {
        var go = this.ciserver();
        var ip = env.name == 'dev' ? go.publicIp : go.privateIp;
        var pipelineName = 'Build';
        var stageName = 'Build';
        var jobName = 'Build';
        return util.format("http://%s:%s/go/files/%s/latest/%s/1/%s/", ip, go.port, pipelineName, stageName, jobName);
    },
    ciserver: function() {
        return {
            publicIp: "50.70.20.40",
            privateIp: "10.20.30.40",
            port: "8153"
        };
    }
}