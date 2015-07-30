var fs = require('fs')

module.exports = function findComponents(dir) {
  // Accumulate all installed components

  return fs.readdirSync(dir)
    .filter(function(file) {
      // filter all packages that look like this: ^hive-*$
      return (file.indexOf('hive-') == 0)
    })
    .map(function(file) {
      var path = dir+"/"+file
        , module = require(path)

      if(typeof(module) != 'function') throw new Error('Component '+file+' doesn\'t expose a setup function for registering.')

      return {
        packagePath: path
      , setup: module
      , provides: module.provides || []
      , consumes: module.consumes || []
      }
    })
}
