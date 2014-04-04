var fs = require('fs')

module.exports = function findComponents(dir) {
  var plugins = {}

  // Accumulate all installed components

  try {

    fs.readdirSync()
      .forEach(function(file) {
        
        // filter all packages that look like this: (hive-*|hivejs) // hivejs is to be installed globally and locally!
        if(file.indexOf('hive-') != 0 && file != 'hivejs') return
        
        var path = './node_modules/'+file
          , module = require(path)
        
        if(typeof(module) != 'function') throw new Error('Component '+file+' doesn\'t expose a setup function for registering.')
        
        plugins[file] = {
          packagePath: path
        , setup: module
        , provides: module.provides || []
        , consumes: module.consumes || []
        }
      })

  }catch(e) {

  }
  
  return plugins
}