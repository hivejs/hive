var fs = require('fs')

module.exports = function() {
  var plugins = {}

  // Accumulate all installed plugins

  fs.readdirSync('./node_modules')
    .forEach(function(file) {
      
      // filter all packages that look like this: (hive-*|hivejs)
      if(file.indexOf('hive-') != 0 && file != 'hivejs') return
      
      var path = './node_modules/'+file
        , module = require(path)
      
      if(typeof(module) != 'function') throw new Error('Plugin '+file+' doesn\'t expose a setup function for registering.')
      
      plugins[file] = {
        packagePath: path
      , setup: module
      , provides: module.provides || []
      , consumes: module.consumes || []
      }
    })
  
  return plugins
}