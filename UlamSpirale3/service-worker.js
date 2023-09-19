// Name des Cache-Speichers
var cacheName = 'cacheUlamSpirale3';

// Dateien, die im Cache gespeichert werden sollen
var filesToCache = [
    './',
    './index.html'
];

// Installation des Service Workers
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
  );
});

// Aktivierung des Service Workers
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(name) {
            if (name !== cacheName) {
              return caches.delete(name);
            }
          })
        );
      })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});