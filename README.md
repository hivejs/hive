# hive.js
This is the main module of [Hive.js](http://hivejs.org).

## The hive module

### The hive command
`hive` is intended to be installed globally as a command.
It will allow you to call any global command named `hive-mycommand` via `hive mycommand`.

If no such command can be found, the hive binary will bootstrap the component system using the
current working directory as a *hive instance directory* from where it will try to load
installed hive components.

Note that components can extend the hive cli, too. Their subcommands will be available
in the context of the current instance.

### Require'ing hive in your application
`hive` also provides an API that allows you to access and start your hive instance in a different node application.

```js
var hive = require('hive')

hive.load(pathToHiveDir, function(err, app) {
  if(er) throw err
})
```