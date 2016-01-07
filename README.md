# hive.js

## The hivejs module

### The hive command
`hivejs` is intended to be installed globally as a command.
It will allow you to call any global command named `hive-mycommand` via `hive mycommand`.

If no such command can be found, the hive binary will bootstrap the component system using the
current working directory as a *hive instance directory* from where it will try to load
installed hive components.

Note that components can extend the hive cli, too. Their subcommands will be available
in the context of the current instance.

### Require'ing hive in your application
`hivejs` also provides an API that allows you to access and start your hive instance in a different node application.

```js
var hive = require('hivejs')

hive.load(pathToHiveDir, function(err, app) {
  if(er) throw err
})
```

## Todo
 * Pass on Waterline's per-model lifecycle callbacks through hooks?
 * Authentication can be done with JWT (json web tokens: http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
 * Streaming http API? twitter's done this already: https://dev.twitter.com/docs/streaming-apis/connecting#User_Agent -- you can also poll their servers though: https://dev.twitter.com/docs/api/1.1/get/statuses/mentions_timeline
 * Logging: logstash seems cool for collecting logs. http://cookbook.logstash.net/recipes/logging-from-nodejs/ (There's prolly also a log4js appender for logstash)
 * Add [jstrace](https://github.com/jstrace/jstrace) probes
 * what about metrics? node-measured, https://github.com/square/cube , might make sense to abstract all this in a stats collecting provider
