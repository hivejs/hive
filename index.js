/**
 * This is the hive main component, responsible for kicking off everything.
 */
var co = require('co')

module.exports = setup
module.exports.consumes = ['cli', 'hooks']

function setup(plugin, imports, next) {
  var cli = imports.cli
    , hooks = imports.hooks
  
  cli.registerCommand('', function (argv) {
    // call hook: main
    co(hooks.callHook)('hive:main', function(err) {
      if(err) throw err
    })
  })
  
  next()
}


var architect = require('architect')
  , findComponents = require('./lib/findComponents')

module.exports.load = function(dir, cb) {
  var componentDir, components
  componentDir = dir+'/node_modules'
  components = findComponents(componentDir)

  architect.createApp(components, cb)
}