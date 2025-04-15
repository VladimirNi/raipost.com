const CACHE_NAME = 'raipost-cache-v1';
const CACHED_URLS = [
  '/',
  '/blog',
  '/about',
  '/styles/global.css',
  '/fonts/atkinson-regular.woff',
  '/fonts/atkinson-bold.woff',
];

// При установке сервис-воркера
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CACHED_URLS);
      })
  );
});

// При активации нового сервис-воркера
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Стратегия кэширования: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кэше
        if (response) {
          return response;
        }

        // Если нет в кэше, делаем запрос к сети
        return fetch(event.request).then(
          (response) => {
            // Проверяем валидность ответа
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ, так как он может быть использован только один раз
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Добавляем ответ в кэш
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
}); 