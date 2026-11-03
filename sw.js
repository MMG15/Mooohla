// Service worker: guarda una copia de la app para que abra sin internet.
// Los datos (gastos) NO pasan por acá: de eso se encarga la caché offline de Firestore.

// Cambiá este número cuando quieras forzar que todos bajen la versión nueva.
const VERSION = 'mooohla-v2';
const APP_CACHE = VERSION + '-app';
const CDN_CACHE = VERSION + '-cdn';

// Archivos propios de la app.
const APP_FILES = [
  './',
  './index.html',
  './firebase-config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon.svg',
  './icons/logo.svg'
];

// Librerías de Firebase: las bajamos de entrada para que la primera vez offline ya ande.
const FIREBASE_VERSION = '10.13.2';
const CDN_FILES = ['firebase-app', 'firebase-firestore', 'firebase-auth'].map(
  (name) => `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/${name}.js`
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE).then((c) => c.addAll(APP_FILES)),
      caches.open(CDN_CACHE).then((c) => c.addAll(CDN_FILES))
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Borra cachés de versiones viejas.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Archivos de la app: primero la red (para tener siempre lo último),
  // y si no hay señal, la copia guardada.
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Firebase SDK y fuentes de Google: no cambian, así que primero la caché.
  if (url.hostname === 'www.gstatic.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Todo lo demás (Firestore, login) va directo a la red, sin tocar.
});

async function networkFirst(req) {
  const cache = await caches.open(APP_CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    if (req.mode === 'navigate') return cache.match('./index.html');
    throw err;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CDN_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
  return res;
}
