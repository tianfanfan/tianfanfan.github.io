importScripts('/vue-fullpage-demo/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/vue-fullpage-demo/_nuxt/2acb7497e6d38ffee4c7.js",
    "revision": "f35f1147030dc7d29ec0d9798337210b"
  },
  {
    "url": "/vue-fullpage-demo/_nuxt/37324dba3e1d3f91e184.js",
    "revision": "1e613b141493ae658718d3fb511a1e1c"
  },
  {
    "url": "/vue-fullpage-demo/_nuxt/498ffb0a1c5be099d739.js",
    "revision": "9b9ac80c269147b2520aa39de9fd4b86"
  },
  {
    "url": "/vue-fullpage-demo/_nuxt/4ce0a4f94fd0f1a5f57a.js",
    "revision": "42b329d2a45f1010cdbec4cb234d22e7"
  },
  {
    "url": "/vue-fullpage-demo/_nuxt/9d9f4df3ad531cae5800.js",
    "revision": "303c76a232d7e675e304394a7f68a96d"
  },
  {
    "url": "/vue-fullpage-demo/_nuxt/ccaa62af116805487efe.js",
    "revision": "af737e80f53abd349942b72c189748b5"
  },
  {
    "url": "/vue-fullpage-demo/_nuxt/edfd43ef9f063a04fd96.js",
    "revision": "8cd3525af74cb43c4c99609584137993"
  }
], {
  "cacheId": "app2",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/vue-fullpage-demo/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/vue-fullpage-demo/.*'), workbox.strategies.networkFirst({}), 'GET')
