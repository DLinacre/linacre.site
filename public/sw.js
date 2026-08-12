// linacre.site service worker
// v14 — refreshed precache list for the consolidated route set (v8).
// Keep API + cross-origin requests untouched (Lab streaming still works).
var CACHE = "linacre-v14";
var OFFLINE_URL = "offline.html";
var URLS = [
  ".",
  "index.html",
  "manifest.json",
  "404.html",
  "500.html",
  "offline.html",
  "about", "contact", "contact/thanks",
  "privacy", "cookie-policy", "terms", "accessibility",
  "lab", "identity", "games", "tools",
  "mob-deals", "pokeguru",
  "games/circuit", "games/circuit.js",
  "games/decrypt", "games/decrypt.js",
  "games/pulse", "games/pulse.js",
  "games/trigger", "games/trigger.js",
  "games/gridlock", "games/gridlock.js",
  "games/slime-factory-tycoon/banner.webp",
  "tools/opagent.html",
  "tools/arena-audit.html",
  "tools/apk-hub.html",
  "tools/dkma-gui.html",
  "tools/ev-bot-advisor.html"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(URLS.map(function (u) { return cache.add(u).catch(function () {}); }));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);

  // Never touch API calls, POSTs, or third-party requests (Lab streaming!)
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/api/") === 0) return;

  // Network-first for page navigations: fresh deploys win, cache is the offline fallback
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (cache) { cache.put(e.request, copy); });
        return r;
      }).catch(function () {
        return caches.match(e.request).then(function (r) {
          return r
              || caches.match("index.html")
              || caches.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // Cache-first with dynamic backfill for other same-origin GETs (manifest, icons, bundle assets)
  e.respondWith(
    caches.match(e.request).then(function (cachedResponse) {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request).then(function (networkResponse) {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          var copy = networkResponse.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(e.request, copy);
          });
        }
        return networkResponse;
      }).catch(function () {
        // Last-resort offline fallback for lost same-origin GETs
        return caches.match(OFFLINE_URL);
      });
    })
  );
});
