/* 以撒成就清单 - Service Worker
 * 页面 network-first，图集/数据 cache-first；所有地址相对于当前站点作用域。
 */
const BASE = self.registration.scope;
const siteUrl = (path) => new URL(path, BASE).href;
const CACHE_PREFIX = 'isaac-checklist:' + BASE + ':';
const CACHE_NAME = CACHE_PREFIX + 'v8';
const CORE = ['./', 'index.html', 'pwa/manifest.json'].map(siteUrl);
const PAGE_DATA = ['data/ach-py.json'].map(siteUrl);
const DATA = ['data/codex.json', 'data/eid-icons.json'].map(siteUrl);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    let assets = [];
    try {
      const res = await fetch(siteUrl('assets/manifest.json'), { cache: 'no-store' });
      const m = res.ok ? await res.json() : null;
      if (m && m.version) {
        assets = Object.values(m)
          .filter((s) => s && typeof s === 'object' && s.file)
          .map((s) => siteUrl('assets/' + s.file + '?v=' + m.version));
      }
    } catch (e) { /* 离线安装：仅缓存核心页面 */ }
    await cache.addAll(CORE.concat(assets, DATA));
    await Promise.all(PAGE_DATA.map(async (u) => {
      try {
        const res = await fetch(u, { cache: 'reload' });
        if (res && res.status === 200) await cache.put(u, res);
      } catch (e) { /* 离线安装：跳过页面数据 */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME)
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(BASE)) return;
  const path = request.url.slice(BASE.length);
  // Steam API 使用实时数据，不进入静态资源缓存。
  if (path.startsWith('api/')) return;
  const cacheFirst = path.startsWith('assets/') || path.startsWith('data/');

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (cacheFirst) {
      const hit = await cache.match(request);
      if (hit) return hit;
    }
    try {
      const res = await fetch(request);
      if (res && res.status === 200) await cache.put(request, res.clone());
      return res;
    } catch (error) {
      const hit = await cache.match(request);
      if (hit) return hit;
      if (request.mode === 'navigate') {
        const page = await cache.match(siteUrl('index.html'));
        if (page) return page;
      }
      throw error;
    }
  })());
});
