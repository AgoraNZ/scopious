// cache name & files to precache
const CACHE_NAME = 'dairy-app-v1';
const ASSETS = [
  '/', 
  '/index.html',
  '/alarm.html',
  '/ticket.html',
  '/dashboard.html',
  '/rules.html',
  '/service-worker.js',
  // add any CSS/JS you host locally here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // cleanup old caches if needed
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Always try network for PouchDB replication endpoints...
  if (url.pathname.startsWith('/tickets') || url.pathname.startsWith('/_pouch')) {
    return event.respondWith(fetch(event.request));
  }
  // Otherwise serve from cache first
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
