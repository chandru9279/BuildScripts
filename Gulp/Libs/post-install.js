// Look into the fixed files, for why the fixes are required. There will be a link to the issue.
// TODO make this generic instead of 2 lines per issue workaround.
var fs = require('fs-extra')

fs.renameSync('node_modules/karma/lib/reporter.js', 'node_modules/karma/lib/reporter_orig.bak')
fs.copySync('Libs/karma_lib/reporter.js', 'node_modules/karma/lib/reporter.js')

fs.renameSync('node_modules/rewireify/lib/index.js', 'node_modules/rewireify/lib/index_orig.bak')
fs.copySync('Libs/rewireify_lib/index.js', 'node_modules/rewireify/lib/index.js')