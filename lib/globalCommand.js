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