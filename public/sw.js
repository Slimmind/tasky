// Cache version
const CACHE_NAME = 'tasky-cache-v1';

// Files to cache
const urlsToCache = [
	'/',
	'/index.html',
	'/static/js/bundle.js',
	'/static/css/main.css',
	'/manifest.json',
	// Add any other static assets that need to be cached
];

// Install service worker and cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

// Activate service worker and remove old caches
self.addEventListener('activate', (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Fetch cached assets or network fallback
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			// Cache hit - return response
			if (response) {
				return response;
			}
			// Network fallback
			return fetch(event.request);
		})
	);
});
