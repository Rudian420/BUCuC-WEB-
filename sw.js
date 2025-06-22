const CACHE_NAME = 'bucuc-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/bootstrap.min.css',
  '/css/bootstrap-icons.css',
  '/css/templatemo-festava-live.css',
  '/js/bootstrap.min.js',
  '/js/jquery.min.js',
  '/js/custom.js',
  '/js/click-scroll.js',
  '/js/jquery.sticky.js',
  '/images/logo.png',
  '/images/logopng.png',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;400;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Cache installation failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline form submissions
  return new Promise((resolve, reject) => {
    // Implementation for background sync
    console.log('Background sync triggered');
    resolve();
  });
}

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from BUCuC!',
    icon: '/images/logo.png',
    badge: '/images/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Events',
        icon: '/images/favicon-32x32.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/favicon-32x32.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BUCuC Update', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#section_5')
    );
  }
}); 