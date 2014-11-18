/**
 * This is the hive node.js API, it allows you to start hive from inside another node app.
 */

var architect = require('architect')
  , findComponents = require('./lib/findComponents')

/**
 * @param dir {String} The hive instance directory to use
 * @param cb {Function} (err, architectApp)
 */
module.exports.load = function(dir, cb) {
  var componentDir, components
  componentDir = dir+'/node_modules'
  components = findComponents(componentDir)

  architect.createApp(components, cb)
}
