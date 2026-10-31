// Line Drill service worker: lets the app open offline once it has been visited.
// Bump VERSION whenever the app shell changes so old caches are cleared.
const VERSION = 'v3';
const SHELL = `line-read-shell-${VERSION}`;
const FONTS = 'line-read-fonts';
const PRECACHE = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    // Also clear caches left by the app's earlier name, line-drill.
    keys.filter(k => (k.startsWith('line-read-shell-') && k !== SHELL) || k.startsWith('line-drill-')).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

async function networkFirst(req){
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req.mode === 'navigate' ? '/' : req, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(req.mode === 'navigate' ? '/' : req)) || Response.error();
  }
}
async function staleWhileRevalidate(req, cacheName){
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const fresh = fetch(req).then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || fresh;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    e.respondWith(staleWhileRevalidate(req, FONTS));
  } else if (url.origin === location.origin){
    e.respondWith(req.mode === 'navigate' || url.pathname === '/' ? networkFirst(req) : staleWhileRevalidate(req, SHELL));
  }
});
