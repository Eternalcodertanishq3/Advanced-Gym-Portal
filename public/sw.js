// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Offline Turnstile Pass Service Worker
// Caches digital pass UI and critical assets for offline gate access
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = "gymflow-pass-v1";
const OFFLINE_URLS = [
  "/member/digital-card",
  "/logo-white.png",
  "/favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Stale-while-revalidate for member QR pass & navigation requests
  if (event.request.mode === "navigate" || event.request.url.includes("/member/digital-card")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/member/digital-card"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => null);
    })
  );
});
