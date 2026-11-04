// linacre.site service worker
// Versioned site cache. Do not delete caches belonging to other applications.
var CACHE = 'linacre-v18';
var OFFLINE_URL = 'offline.html';
var URLS = [
  '.',
  'index.html',
  'manifest.json',
  '404.html',
  '500.html',
  'offline.html',
  'about',
  'contact',
  'contact/thanks',
  'privacy',
  'cookie-policy',
  'terms',
  'accessibility',
  'lab',
  'identity',
  'games',
  'games/',
  'games/index.html',
  'games/games.json',
  'games/manifest.webmanifest',
  'games/assets/brand/favicon.svg',
  'games/assets/brand/emblem-256.png',
  'games/assets/fonts/manrope-800.woff2',
  'tools',
  'mob-deals',
  'pokeguru',
  'tools/opagent.html',
  'tools/arena-audit.html',
  'tools/apk-hub.html',
  'tools/dkma-gui.html',
  'tools/ev-bot-advisor.html',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(
        URLS.map(function (u) {
          return cache.add(u).catch(function () {});
        }),
      );
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k.indexOf('linacre-v') === 0 && k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);

  // Never touch API calls, POSTs, streaming audio, or third-party requests (Lab streaming!)
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.indexOf('/api/') === 0) return;
  if (url.pathname.indexOf('/audio/') === 0) return;

  // Network-first for page navigations: fresh deploys win, cache is the offline fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(function (r) {
          if (r.ok) {
            var copy = r.clone();
            caches.open(CACHE).then(function (cache) {
              return cache.put(e.request, copy);
            });
          }
          return r;
        })
        .catch(function () {
          return caches.match(e.request).then(function (r) {
            return r || caches.match('index.html').then(function (index) {
              return index || caches.match(OFFLINE_URL);
            });
          });
        }),
    );
    return;
  }

  // Cache-first with dynamic backfill for other same-origin GETs (manifest, icons, bundle assets)
  e.respondWith(
    caches.match(e.request).then(function (cachedResponse) {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request)
        .then(function (networkResponse) {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            var copy = networkResponse.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(e.request, copy);
            });
          }
          return networkResponse;
        })
        .catch(function () {
          // Last-resort offline fallback for lost same-origin GETs
          return Response.error();
        });
    }),
  );
});
