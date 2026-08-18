// sw.js - Service Worker básico con estrategia de caché
const CACHE_NAME = 'visor-turnos-v1';
const urlsToCache = [
  './',
  './index.html',          // Asegúrate de que tu HTML se llame index.html (o cambia el nombre)
  './manifest.json',
  // Añade aquí otros recursos si los tienes (CSS, JS, imágenes)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Si no hay conexión y no está en caché, puedes devolver una página offline
        // return caches.match('/offline.html');
      })
  );
});