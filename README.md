# hive.js

## hivejs

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

## What is a hive instance?
Similar to a git repository, a hive instance is simply a folder where your instance lives:
code, configuration and any other stuff you might want to add all in one place.

```
your-hive-instance/
+-node_modules/
  +-components..
+-config/
  +-development.json
  +-test.json
  +-production.json
+-package.json
```

#### Components
The hive code base is organized in components that live in `your-hive-instance/node_modules/` and
are conveniently managed via `your-hive-instance/package.json` as you would expect from a node project.

#### Config
Configuration files are stored in `your-hive-instance/config/` as `development.json`, `test.json` and `production.json`.

#### hive-init
Running `hive-init(1)` will briefly guide you through the set-up of your hive instance dir, installing
the standard components as well as creating the necessary config files.


## What are components?
Everything you would like to add to hive is going to be wrapped in a component.

A `hive-<component>` can register a *provider* and can consume providers by other components.
A provider can do stuff for you, e.g. an auth provider can do authentication.

Application tasks (e.g. http, worker-pool, etc.) are encapsuled as *services*.
The beauty of services is that they can be started internally in the main
process or externally in a separate process. You can register your services with
the services provider.

Note that hive doesn't implement a way to re-start specific services since this
would require assumptions that would limit your choices about the set-up and
architecture of your instance.

Usually a component is either a *provider* or a *service*, although in rare cases it might be both, e.g. the http component is a kind of registry provider
while encapsuling the actual http server in a service.

## Parts of hive

### Standard server-side providers
 * [hooks](https://github.com/hivejs/hive-hooks) -- allows registration and emission of hooks
 * [logger](https://github.com/hivejs/hive-logger) -- provides logging functionality
 * [config](https://github.com/hivejs/hive-config) -- loads and provides the configuration
 * [cli](https://github.com/hivejs/hive-cli) -- register your subcommands here
 * [services](https://github.com/hivejs/hive-services) -- register your services here
 * broadcast (impl. by [broadcast-memory](https://github.com/hivejs/hive-broadcast-memory)) -- DuplexStream that allows FIFO broadcasting of new changes
 * [http](https://github.com/hivejs/hive-http) -- a koa.js instance
 * [orm](https://github.com/hivejs/hive-orm) -- Sets up the orm (waterline) and emits the orm:initialize hook to allow tweaking of settings
 * [ot](https://github.com/hivejs/hive-ot) -- Allows registration of ot types
 * [assets](https://github.com/hivejs/hive-assets) -- Allows registration of directories with static files and client-side components
 * [sync](https://github.com/hivejs/hive-sync) -- Manages gulf Documents
 * [auth](https://github.com/hivejs/hive-auth) -- Allows registration of authentication methods and authorization implementations

### Standard client-side providers
 * [ui](https://github.com/hivejs/hive-ui) -- kicks off everything on the client side and provides the page.js instance
 * [ui-auth](https://github.com/hivejs/hive-ui-auth) -- allows registration of authentication methods and handles authentication
 * [ui-editor](https://github.com/hivejs/hive-ui-editor) -- allows registration of editors for OT types and connects them to the server

### Standard services
 * [http](https://github.com/hivejs/hive-http) -- the http server
 * [queue](https://github.com/hivejs/hive-queue) -- a semaphore that tells each worker when it's turn has come to commit changes

### Standard commands
 * [hive(1)](https://github.com/hivejs/hive) -- main binary
 * hive-init(1) -- easily set-up your hive instance

### Other standard components
 * [models](https://github.com/hivejs/hive-models) -- registers the built-in data models and emits models:load and models:loaded to allow addition and tweaking of models
 * [rest-api](https://github.com/hivejs/hive-models) -- registers the REST API, which is the stadard hive interface (one way to interface with hive in your app)
 * [shoe-interface](https://github.com/hivejs/hive-shoe-interface) -- the streaming collaboration interface used by hive-ui-editor

### Libraries
 * [api-client](https://github.com/hivejs/api-client) -- a consumer of hive-rest-api
 * [shoe-client](https://github.com/hivejs/api-client) -- a consumer of hive-shoe-interface

## Architecture
```
          Clients
           |   ^
   --------|---|-------------------
           v   |
        [  Interfaces  ]---> [       ]
        [  (Auth)------]---> [Plugins]
         |     |     ^       [       ]
         v     v     |       [       ]
    [Model] [  Sync  |] ---> [       ]
     |       ^    |  |
     |       |    |  |
    -|-------|----|--|-----------
     v       v    v  |
   [DB] [Queue] [Broadcast]

```

## Client-side
A component can register files to be loaded by the client-side loader with the assets provider. (Don't worry, hive-assets is a noop on the client-side, so simple components will work there, too.)

## Todo
 * Pass on Waterline's per-model lifecycle callbacks through hooks?
 * hive-init(1): default config files are empty :/ -- Perhaps allow components to register defaults that are used by hive-init to populate the files (wouldn't allow for commens though...)
 * Authentication can be done with JWT (json web tokens: http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
 * Streaming http API? twitter's done this already: https://dev.twitter.com/docs/streaming-apis/connecting#User_Agent -- you can also poll their servers though: https://dev.twitter.com/docs/api/1.1/get/statuses/mentions_timeline
 * Logging: logstash seems cool for collecting logs. http://cookbook.logstash.net/recipes/logging-from-nodejs/ (There's prolly also a log4js appender for logstash)
 * Add [jstrace](https://github.com/jstrace/jstrace) probes
 * what about metrics? node-measured, https://github.com/square/cube , might make sense to abstract all this in a stats collecting provider




## Provider interfaces, delegators, the hooks provider -- when to use what?
When the time has come and you want to outsource some of your functionality, you have the choice between provider interfaces, delegators and the global hooks provider. Now, which do you use?

### Provider interface
If your component depends on the functionality of the outsourced code, e.g. you need its return value, then that's a clear sign that you need to define an interface that an external provider will implement.

### Delegator
If you want to be able to plug in more than one component (e.g. different authentication providers should be supported), you can create a provider that allows to register delegates, and calls out to the delegates to execute the task or provide the requested functionality  for it, combining their output if necessary.

An example for a delegating provider is the auth provider defined by Hive core: Authentication providers are to be named `auth-` and register with the auth provider *providing* an authentication method.

#### Hooking
If your component does not directly depend on the functionality of outsourced parts, use the hook system -- just call a hook with a few arguments and be done with it.

The difference between a hook and an event listener is that you will want to wait for the hook to finish executing, while with events it's just "fire and forget".


## Handling Auth
Let's assume there is a registered authentication provider called `auth-facebook` providing an authentication method called `facebook`.
The various hive interfaces (e.g. REST, gulf, tcp, etc.) are responsible for handling user sessions. Each submitted action must be successfully authenticated and authorized.

Suggestion:
There should be a special action solely for the purpose of authentication that returns a token that may be used as a simplified authentication method for future requests.