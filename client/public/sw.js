const CACHE_NAME = 'fridayquest-v1';
const STATIC_CACHE_NAME = 'fridayquest-static-v1';

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// Install Event: pre-cache application shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: clean up obsolete cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== STATIC_CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Intelligent routing (Network-First for navigation, Stale-While-Revalidate for static assets)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Never intercept API calls, auth routes, or WebSocket handshakes
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/socket.io/') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // 2. HTML navigation requests (Network-First with Cache Fallback for offline usage)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone and cache in runtime cache
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed: attempt to retrieve cached version of this page
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to cached home page
          const fallback = await caches.match('/');
          if (fallback) {
            return fallback;
          }
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              <title>FridayQuest - Offline</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #090d16; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
                .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 1.5rem; padding: 2rem; max-width: 420px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
                h1 { font-size: 1.5rem; font-weight: 800; margin: 0.5rem 0; }
                p { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem; }
                button { background: #2563eb; color: #fff; border: none; border-radius: 0.75rem; padding: 0.75rem 1.5rem; font-weight: 700; cursor: pointer; font-size: 0.875rem; }
              </style>
            </head>
            <body>
              <div class="card">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📶</div>
                <h1>You Are Currently Offline</h1>
                <p>FridayQuest requires a network connection to join real-time live rooms. Cached app screens and game definitions will load once connectivity resumes.</p>
                <button onclick="window.location.reload()">Retry Connection</button>
              </div>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 3. Static Assets: Next.js bundles, CSS, JS, fonts, images (Stale-While-Revalidate)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }
});

