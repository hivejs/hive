# hive.js

Every `hive-<component>` usually registers a provider that can be consumed by other components.
One component can register multiple providers.
A provider can do stuff for you, e.g. an auth provider can do authentication.

Peripheral or expensive tasks can be outsourced into a service.
Services register with the services provider.
Services can be started internally or externally (in a separate process; default).
The services provider runs a controller instance that manages the various services by having them connect to a control port.