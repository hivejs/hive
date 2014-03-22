module.exports = setup
module.exports.consumes = ['cli']

function setup(plugin, imports, register) {
  var cli = imports.cli
  
  cli.registerCommand('', function(argv) {
    
  })
  
  register()
}