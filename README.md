# hive.js
This is the kick-off module of [Hive.js](http://hivejs.org).

Hive.js is a real-time collaboration platform. It supports multiple document types and editors, features unopinionated authentication and authorization, is scalable (you can spin up several workers and things won't break), is integratable through a rich RESTful API and a websocket-based interface, with support for adding additional interfaces.

See the [Roadmap](https://github.com/hivejs/hive/wiki/Roadmap) and [the issues](https://github.com/hivejs/hive/issues) for planned features.  
The [wiki](https://github.com/hivejs/hive/wiki) is intended to familiarize new developers with the code base (This is on the to-do).  
A less exhaustive, but more structured source of information are the [official docs](http://docs.hivejs.org).  
Check [the blog](http://blog.hivejs.org) and [the mailing list](http://groups.google.com/d/forum/hivejs) from time to time.  
There's an IRC channel on freenode.net: [#hive.js](http://webchat.freenode.net/?channels=#hive.js)  
And there's a [gitter chat room](https://gitter.im/hivejs/chat).  
You can also send a mail directly to [Marcel Klehr](https://github.com/marcelklehr), if you want a quick reply.  

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
