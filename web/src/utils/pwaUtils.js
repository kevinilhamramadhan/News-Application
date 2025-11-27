/**
 * PWA Utility Functions for BeritaKu
 * Handles service worker registration, caching, and PWA features
 */

/**
 * Check if the browser is online
 */
export const checkOnlineStatus = () => {
    return navigator.onLine;
};

/**
 * Get storage estimate to monitor cache size
 */
export const getStorageEstimate = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage || 0,
                quota: estimate.quota || 0,
                usageInMB: ((estimate.usage || 0) / (1024 * 1024)).toFixed(2),
                quotaInMB: ((estimate.quota || 0) / (1024 * 1024)).toFixed(2),
                percentUsed: estimate.quota ? ((estimate.usage / estimate.quota) * 100).toFixed(2) : 0
            };
        } catch (error) {
            console.error('Error getting storage estimate:', error);
            return null;
        }
    }
    return null;
};

/**
 * Request persistent storage
 */
export const requestPersistentStorage = async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
        try {
            const isPersisted = await navigator.storage.persist();
            console.log(`Persistent storage ${isPersisted ? 'granted' : 'denied'}`);
            return isPersisted;
        } catch (error) {
            console.error('Error requesting persistent storage:', error);
            return false;
        }
    }
    return false;
};

/**
 * Clear old caches (for maintenance)
 */
export const clearOldCache = async () => {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            const oldCaches = cacheNames.filter(name => {
                // Keep workbox caches, remove others
                return !name.startsWith('workbox-') && !name.startsWith('beritaku-');
            });

            await Promise.all(
                oldCaches.map(cacheName => caches.delete(cacheName))
            );

            console.log(`Cleared ${oldCaches.length} old cache(s)`);
            return oldCaches.length;
        } catch (error) {
            console.error('Error clearing old cache:', error);
            return 0;
        }
    }
    return 0;
};

/**
 * Get all cached URLs
 */
export const getCachedUrls = async () => {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            const urls = [];

            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const requests = await cache.keys();
                urls.push(...requests.map(req => req.url));
            }

            return [...new Set(urls)]; // Remove duplicates
        } catch (error) {
            console.error('Error getting cached URLs:', error);
            return [];
        }
    }
    return [];
};

/**
 * Check if a specific URL is cached
 */
export const isUrlCached = async (url) => {
    if ('caches' in window) {
        try {
            const cache = await caches.open('beritaku-runtime');
            const response = await cache.match(url);
            return !!response;
        } catch (error) {
            console.error('Error checking if URL is cached:', error);
            return false;
        }
    }
    return false;
};

/**
 * Manually cache a news article
 */
export const cacheNewsArticle = async (articleUrl, articleData) => {
    if ('caches' in window) {
        try {
            const cache = await caches.open('beritaku-news-cache');
            const response = new Response(JSON.stringify(articleData), {
                headers: { 'Content-Type': 'application/json' }
            });
            await cache.put(articleUrl, response);
            console.log('Article cached:', articleUrl);
            return true;
        } catch (error) {
            console.error('Error caching article:', error);
            return false;
        }
    }
    return false;
};

/**
 * Get cached news articles
 */
export const getCachedNews = async () => {
    if ('caches' in window) {
        try {
            const cache = await caches.open('beritaku-news-cache');
            const requests = await cache.keys();
            const articles = [];

            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const data = await response.json();
                    articles.push(data);
                }
            }

            return articles;
        } catch (error) {
            console.error('Error getting cached news:', error);
            return [];
        }
    }
    return [];
};

/**
 * Check if app is installed as PWA
 */
export const isPWAInstalled = () => {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }

    // Check if running as PWA on iOS
    if (window.navigator.standalone === true) {
        return true;
    }

    return false;
};

/**
 * Get PWA display mode
 */
export const getPWADisplayMode = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return 'standalone';
    }
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
        return 'fullscreen';
    }
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
        return 'minimal-ui';
    }
    return 'browser';
};

/**
 * Detect if device is iOS
 */
export const isIOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Detect if device is Android
 */
export const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
};

/**
 * Get device type
 */
export const getDeviceType = () => {
    if (isIOS()) return 'ios';
    if (isAndroid()) return 'android';
    return 'desktop';
};

/**
 * Check if browser supports PWA
 */
export const supportsPWA = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Log PWA analytics event
 */
export const logPWAEvent = (eventName, eventData = {}) => {
    // This can be integrated with your analytics service
    console.log('[PWA Event]', eventName, eventData);

    // Example: Send to analytics service
    // if (window.gtag) {
    //   window.gtag('event', eventName, eventData);
    // }
};

/**
 * Show install instructions based on device
 */
export const getInstallInstructions = () => {
    const device = getDeviceType();

    if (device === 'ios') {
        return {
            title: 'Install BeritaKu di iOS',
            steps: [
                'Tap tombol Share (ikon kotak dengan panah)',
                'Scroll ke bawah dan pilih "Add to Home Screen"',
                'Tap "Add" untuk menginstall'
            ]
        };
    }

    if (device === 'android') {
        return {
            title: 'Install BeritaKu di Android',
            steps: [
                'Tap tombol menu (tiga titik) di browser',
                'Pilih "Add to Home screen" atau "Install app"',
                'Tap "Install" untuk menginstall'
            ]
        };
    }

    return {
        title: 'Install BeritaKu',
        steps: [
            'Klik tombol Install di address bar',
            'Atau klik tombol Install yang muncul di halaman',
            'BeritaKu akan terbuka sebagai aplikasi standalone'
        ]
    };
};

export default {
    checkOnlineStatus,
    getStorageEstimate,
    requestPersistentStorage,
    clearOldCache,
    getCachedUrls,
    isUrlCached,
    cacheNewsArticle,
    getCachedNews,
    isPWAInstalled,
    getPWADisplayMode,
    isIOS,
    isAndroid,
    getDeviceType,
    supportsPWA,
    logPWAEvent,
    getInstallInstructions
};
