var repoPath = __dirname + "/../";
var sourcePath = repoPath + "Source/"
var buildScripts = repoPath + "BuildScripts/Gulp/"
var buildScriptModules = buildScripts + "node_modules/"

module.exports = function (config) {
    config.set({
        basePath: sourcePath,
        frameworks: ['jasmine', 'browserify'],
        // autoWatch: false, // gulp populates this
        autoWatchBatchDelay: 1000, // milliseconds
        browsers: ['PhantomJS'],
        // browsers: ['Firefox', 'Chrome'], // Uncomment this line for running in browsers
        files: [], // sources and tests are included via gulp
        exclude: [],
        port: 9000,
        reporters: ['progress', 'html', 'coverage'],

        preprocessors: {
            'Web.JasmineTests/**/*.js': ["browserify"]
        },

        browserify: {
            debug: true,
            // this needs full path, since karma-bro plugin sets CWD to the same as the test module that's being bundled
            transform: [
                buildScripts + 'Libs/istanbul-configured',
                buildScripts + 'node_modules/rewireify'
            ]
        },

        // see what is going on
        // logLevel: 'LOG_DEBUG',

        coverageReporter: {
            reporters: [
                {
                    type: 'html',
                    dir: '../Build/Artifacts/JavascriptTests/coverage/',
                    subdir: function (browser) {
                        /* normalization process to keep a consistent browser name accross different
                           OS. In build agent the folder name was "PhantomJS 1.9.7 (Windows 8)" */
                        return browser.toLowerCase().split(/[ /-]/)[0];
                    }
                },
                { type: 'text-summary' }
            ]
        },

        htmlReporter: {
            // Path is relative to basePath which is <Repo>/Source/
            // https://www.npmjs.org/package/karma-htmlfile-reporter is much better looking than https://www.npmjs.org/package/karma-html-reporter
            // karma-jasmine-html-reporter(-livereleoad) both have bugs
            outputFile: '../Build/Artifacts/JavascriptTests/results.html'
        },

        /* 
        // These options must be resued when building assets. test config should be == build config
        typescriptPreprocessor: {

            options: {
                sourceMap: false, // no use when running tests
                target: 'ES3', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
                module: 'commonjs', // For require.js use AMD, for node.js style requires, use commonjs
                noImplicitAny: false, // allow return type to be any
                noResolve: false, // we need the .d.ts references to be resolved.
                removeComments: true // (optional) Do not emit comments to output.
            },

            // transforming the filenames
            transformPath: function (path) {
                return path.replace(/\.ts$/, '.js');
            }
        }
        */
    });
};