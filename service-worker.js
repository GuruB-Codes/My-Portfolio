// Kill-switch Service Worker
// This replaces the old Nexora service worker and forces it to unregister and clear caches.

self.addEventListener('install', (e) => {
  // Force the new service worker to take over immediately
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    // 1. Clear all old caches (this wipes out the old Nexora cached files)
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // 2. Unregister this service worker so it doesn't run anymore
      return self.registration.unregister();
    }).then(() => {
      // 3. Take control of all clients so the next reload comes from the network
      return self.clients.claim();
    })
  );
});
