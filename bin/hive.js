var architect = require('architect')
  , findPlugins = require('../lib/findPlugins') 

// Create the architect instance
architect
  .createApp(findPlugins(), function(er, app) {
    if(er) throw er
    
     app.getService('cli')
  })