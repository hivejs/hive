v0.8.0
 * [general] NEW localizations from [translatewiki](https://translatewiki.net)
 * [general] NEW license: MPL 2.0
 * [interface & ui] Switched from sockJS/shoe to [primus](https://github.com/primus/primus) and use engine.io
 * [ui] NEW Introduce build step using gulp and uglify.js
 * [ui] NEW Lazy-load editor js code to reduce initial load time
 * [interface:rest-api] NEW Expose full waterline query language through `?filter[...]=` params
 * [core] FIX mysql/postgres support
 * [core] NEW Turn orm into a service
 * [ui/localize] NEW Auto-detect user locale
 * [core/http] NEW expose http server from the start (koa callback is still compiled lazily)
 * [core/http] NEW Establish http:bindMiddleware hook
 * [ui/session] FIX stream loading and beautify "offline" indicator
 * [core/config] FIX env config provider
