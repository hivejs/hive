
/**
 * This is the main hive binary
 */
var architect = require('architect')
  , findComponents = require('../lib/findComponents') 
  , globalCommand = require('../lib/globalCommand') 



if(process.argv[2] && globalCommand.exists(process.argv[2])) {

  // launch a helper command

  globalCommand.run(process.argv[2], process.argv.slice(3))
    .on('close', function(code){
      process.exit(code);
    })
  

} else {

  // Spin up the architect app

  var componentDir, components
  componentDir = process.cwd()+'/node_modules'
  components = findComponents(componentDir)

  architect
    .createApp(components, function(er, app) {
         if(er) throw er
         app.getService('cli').dispatch(process.argv)
    })

}