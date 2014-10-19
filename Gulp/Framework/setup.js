var argv = require('yargs').argv;
var path = require('path');

module.exports = {
    setup : function() {
        global.commandline = argv;
        global.env = {
            repoPath: argv.repoPath? argv.repoPath : path.resolve('../../') + '/' 
        };
        global.gulp = require('gulp');
        global.conventions = require(env.repoPath + 'BuildConfigs/Conventions.js');
        global.gutil = require('gulp-util');
        global.buildLibs = '..\\Libs\\';
        this.requireTasks();
    },
    requireTasks : function() {
        require('../Build/css-pipeline.js');
        require('../Build/vendor-css-pipeline.js');
        require('../Build/css-styling.js');
        require('../Build/js-pipeline.js');
        require('../Build/vendor-js-pipeline.js');
        require('../Build/bower-cherry-pick.js');
        require('../Build/js-testing.js');
        require('../Build/js-styling.js');
        require('../Framework/workflows.js');
    }
}