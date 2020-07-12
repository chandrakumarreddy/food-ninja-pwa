const staticCache = "site-static-v2";
const dynamicCache = "site-dynamic-v2";
// app shell resources
const assets = [
  "/",
  "/index.html",
  "/img/dish.png",
  "/css/materialize.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "/css/styles.css",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/pages/fallback.html",
];

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(staticCache).then(function (cache) {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== cacheName && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (cacheRes) =>
        cacheRes ||
        fetch(event.request)
          .then((fetchRes) => {
            return caches.open(dynamicCache).then((cache) => {
              cache.put(event.request.url, fetchRes.clone());
              limitCacheSize(dynamicCache, 15);
              return fetchRes;
            });
          })
          .catch(() => {
            if (event.request.url.indexOf(".html") > -1)
              caches.match("/pages/fallback.html").then(cacheRes);
          })
    )
  );
});
