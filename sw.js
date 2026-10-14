/* 家庭手账本 Service Worker：离线缓存 + 通知点击 */
var CACHE = 'family-ledger-v6';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;
  var isHtml = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') >= 0 || /index\.html$/i.test(url.pathname) || url.pathname.endsWith('/');
  /* HTML 网络优先，避免提醒/推送逻辑被旧缓存卡住 */
  if (isHtml) {
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match('./index.html'); });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        try {
          if (res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
        } catch (err) {}
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var target = (e.notification && e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url && 'focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

/* 预留：若日后接入 Web Push，在此处理 push 事件 */
self.addEventListener('push', function (e) {
  var title = '家庭手账本提醒';
  var body = '你有一条提醒';
  var data = { url: './' };
  try {
    if (e.data) {
      var j = e.data.json();
      if (j.title) title = j.title;
      if (j.body) body = j.body;
      if (j.url) data.url = j.url;
    }
  } catch (err) {
    try { body = e.data.text(); } catch (e2) {}
  }
  e.waitUntil(self.registration.showNotification(title, {
    body: body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    data: data,
    tag: 'family-ledger-push'
  }));
});
