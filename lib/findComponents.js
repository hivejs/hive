/**
 * hive.js
 * Copyright (C) 2013-2015 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var fs = require('fs')

module.exports = function findComponents(dir, dontFilter) {
  // Accumulate all installed components
  var additionalComponents = []

  var components = fs.readdirSync(dir)
    .filter(function(file) {
      // filter all packages that begin with `hive-` but exclude `hive-client`s
      return (dontFilter || file.indexOf('hive-') == 0 && file.indexOf('hive-client') != 0)
    })
    .map(function(file) {
      var path = dir+"/"+file

      if(!dontFilter) {
        try {
          fs.accessSync(path+'/index.js')
        }catch(e) {
          additionalComponents = additionalComponents.concat(findComponents(path+'/components', true))
          return
        }
      }

      var module = require(path)

      if(typeof(module) != 'function') throw new Error('Component '+file+' doesn\'t expose a setup function for registering.')

      return {
        packagePath: path
      , setup: module
      , provides: module.provides || []
      , consumes: module.consumes || []
      }
    })
    .filter(component => !!component)
    .concat(additionalComponents)

  return components
}
