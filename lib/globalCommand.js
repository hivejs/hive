var spawn = require('child_process').spawn
  , path = require('path')
  , stat = require('fs').statSync
  , exists = require('fs').existsSync

exports.exists = function findGlobalCommand(cmd) {
  var bin = 'hive-'+cmd

  bin = splitPath(process.env.PATH)
          .reduce(function(binary, p) {
            var pbin = resolve(p, bin)
            return exists(pbin) && stat(pbin).isFile() ? pbin : binary
          }, bin)
  
  return exists(bin)
}

exports.run = function(cmd, args) {
  return spawn('hive-'+cmd, args, {
    stdio: 'inherit'
  , cwd: process.cwd()
  , env: process.env
  , detached: false
  })
}


function splitPath(path) {
  var delim = (process.platform == 'win32')? ';' : ':'
  return path.split(delim)
}