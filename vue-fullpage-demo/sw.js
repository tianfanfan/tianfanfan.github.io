importScripts('/vue-fullpage-demo/nuxt-public/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/vue-fullpage-demo/nuxt-public/498ffb0a1c5be099d739.js",
    "revision": "9b9ac80c269147b2520aa39de9fd4b86"
  },
  {
    "url": "/vue-fullpage-demo/nuxt-public/4ce0a4f94fd0f1a5f57a.js",
    "revision": "42b329d2a45f1010cdbec4cb234d22e7"
  },
  {
    "url": "/vue-fullpage-demo/nuxt-public/9d9f4df3ad531cae5800.js",
    "revision": "303c76a232d7e675e304394a7f68a96d"
  },
  {
    "url": "/vue-fullpage-demo/nuxt-public/a89a2963f72782d01b0a.js",
    "revision": "3b1973aab6d4128afe3289326d031a74"
  },
  {
    "url": "/vue-fullpage-demo/nuxt-public/c1cf3f4bc56fe4c2750c.js",
    "revision": "99dcd882c63628a2a2992df24660d02d"
  },
  {
    "url": "/vue-fullpage-demo/nuxt-public/ccaa62af116805487efe.js",
    "revision": "af737e80f53abd349942b72c189748b5"
  },
  {
    "url": "/vue-fullpage-demo/nuxt-public/edfd43ef9f063a04fd96.js",
    "revision": "8cd3525af74cb43c4c99609584137993"
  }
], {
  "cacheId": "app2",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/vue-fullpage-demo/nuxt-public/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/vue-fullpage-demo/.*'), workbox.strategies.networkFirst({}), 'GET')
