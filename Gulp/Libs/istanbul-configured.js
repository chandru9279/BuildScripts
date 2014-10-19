var brist = require('browserify-istanbul');
module.exports = brist({
    // https://github.com/isaacs/minimatch - ['**Web.JasmineTests**'] will not work. ** is treated differently in paths
    ignore: ['**/Web.JasmineTests/**'],

    // Ignores ['**/node_modules/**', '**/test/**', '**/tests/**']
    defaultIgnore: true
})