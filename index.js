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