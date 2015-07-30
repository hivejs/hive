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
var spawn = require('win-fork')
  , resolve = require('path').resolve
  , stat = require('fs').statSync
  , exists = require('fs').existsSync

exports.exists = function findGlobalCommand(cmd) {
  var bin = 'hive-'+cmd

  bin = splitPath(process.env.PATH)
          .reduce(function(binary, p) {
            var pbin = resolve(p, bin)
            return exists(pbin) && stat(pbin).isFile() ? pbin : binary
          }, bin)
  
  if(exists(bin)) return bin

  return false
}

exports.run = function(bin, args, cb) {
  return spawn(bin, args, {
    stdio: 'inherit'
  , cwd: process.cwd()
  , env: process.env
  , detached: false
  })
    .on('error', function(e) {
      console.log('Spawning `'+bin+' '+args.join(' ')+'` failed')
      throw e
    })
    .on('close', function(code) {
      cb(code)
    })
}


function splitPath(path) {
  var delim = (process.platform == 'win32')? ';' : ':'
  return path.split(delim)
}