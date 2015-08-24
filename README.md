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
 * hive-init(1): default config files are empty :/ -- Perhaps allow components to register defaults that are used by hive-init to populate the files (wouldn't allow for commens though...)
 * Authentication can be done with JWT (json web tokens: http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
 * Streaming http API? twitter's done this already: https://dev.twitter.com/docs/streaming-apis/connecting#User_Agent -- you can also poll their servers though: https://dev.twitter.com/docs/api/1.1/get/statuses/mentions_timeline
 * Logging: logstash seems cool for collecting logs. http://cookbook.logstash.net/recipes/logging-from-nodejs/ (There's prolly also a log4js appender for logstash)
 * Add [jstrace](https://github.com/jstrace/jstrace) probes
 * what about metrics? node-measured, https://github.com/square/cube , might make sense to abstract all this in a stats collecting provider


# FAQ

## Client-side module exposure: page.js context vs. architect
There is some redundancy between exposing a module as a client-side provider (an architect service) and exposing it via page.js's context object. This section's purpose is to clarify when to use what:

### Client-side providers
If your module has value beyond the scope of a single page, then you should expose it as a client-side provider. This was done, for example, with `hive-ui-auth`, which is used by `hive-ui-editor`, however there might be various other instances where authentication is necessary, therefore it is exposed as a provider.

### Page.js's context
If your module is tailored for a particular page and specifically depends on some features of that page, as is the case with the document page (`/:id`), and you can't think of a reason why anyone would need it on a different page, then you should expose it on page.js's context object. If however some core concept of your module does seem to be useful in other contexts, you might want to think about exposing this part as a provider while still adding it to the desired context or even outsourcing it entirely and depdening on it in a separate more specifc module that adds it to the desired context.


## Provider interfaces, delegators, the hooks provider -- when to use what?
When the time has come and you want to outsource some of your functionality, you have the choice between provider interfaces, delegators and the global hooks provider. Now, which do you use?

### Provider interface
If your component depends on the functionality of the outsourced code, e.g. you need its return value, then that's a clear sign that you need to define an interface that an external provider will implement.

An example of this is the broadcast interface, implemented e.g. by Hive.js core component `hive-broadcast-memory`.

### Delegator
If you want to be able to plug in more than one component (e.g. different authentication providers should be supported), you can create a provider that allows to register delegates, and calls out to the delegates to execute the task or provide the requested functionality  for it, combining their output if necessary.

An example for a delegating provider is the `auth` provider implemented by Hive.js core component `hive-auth`: Authentication providers are to be named `auth-` and register with the auth provider *providing* an authentication method.

#### Hooking
If your component does not directly depend on the functionality of outsourced parts, use the hook system -- just call a hook with a few arguments and be done with it.

The difference between a hook and an event listener is that you will want to wait for the hook to finish executing, while with events it's just "fire and forget".
