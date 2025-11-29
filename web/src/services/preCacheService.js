import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Pre-Cache Service
 * Handles automatic caching of essential content on first visit
 * for optimal offline experience
 */

// LocalStorage key for cache status
const CACHE_STATUS_KEY = 'preCacheStatus';
const CACHE_VERSION = '1.0.0';

// Excluded endpoints that should NOT be cached
const EXCLUDED_PATTERNS = [
    /\/api\/auth\//,
    /\/api\/bookmarks\//,
    /\/admin\//,
    /\/profil/,
];

/**
 * Check if this is the first visit or cache needs refresh
 */
export const isFirstVisit = () => {
    try {
        const cacheStatus = localStorage.getItem(CACHE_STATUS_KEY);
        if (!cacheStatus) return true;

        const status = JSON.parse(cacheStatus);

        // Check if cache version matches
        if (status.version !== CACHE_VERSION) return true;

        // Check if cache is complete
        if (!status.isComplete) return true;

        return true;
    } catch (error) {
        // Silent error handling
        return true;
    }
};

/**
 * Get current cache status
 */
export const getCacheStatus = () => {
    try {
        const cacheStatus = localStorage.getItem(CACHE_STATUS_KEY);
        if (!cacheStatus) return null;

        return JSON.parse(cacheStatus);
    } catch (error) {
        // Silent error handling
        return null;
    }
};

/**
 * Save cache status to localStorage
 */
const saveCacheStatus = (status) => {
    try {
        const cacheStatus = {
            version: CACHE_VERSION,
            timestamp: new Date().toISOString(),
            ...status,
        };
        localStorage.setItem(CACHE_STATUS_KEY, JSON.stringify(cacheStatus));
    } catch (error) {
        // Silent error handling
    }
};

/**
 * Clear cache and reset status
 */
export const clearCache = async () => {
    try {
        // Clear localStorage status
        localStorage.removeItem(CACHE_STATUS_KEY);

        // Clear Service Worker caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }

        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

/**
 * Pre-load images from articles
 */
const preloadImages = async (articles, onProgress) => {
    const images = articles
        .map(article => article.gambar_url)
        .filter(url => url && !EXCLUDED_PATTERNS.some(pattern => pattern.test(url)));

    const totalImages = images.length;
    let loadedImages = 0;

    const imagePromises = images.map(async (imageUrl) => {
        try {
            // Create image element to trigger browser caching
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUrl;
            });

            loadedImages++;

            // Report progress
            if (onProgress) {
                const imageProgress = (loadedImages / totalImages) * 100;
                onProgress({
                    percentage: 90 + (imageProgress * 0.10), // Images are 90-100%
                    status: `Memuat gambar (${loadedImages}/${totalImages})`,
                    itemsCached: loadedImages,
                });
            }
        } catch (error) {
            // Silently ignore individual image load errors
            loadedImages++;
        }
    });

    // Load images in parallel but limit concurrency
    const batchSize = 5;
    for (let i = 0; i < imagePromises.length; i += batchSize) {
        const batch = imagePromises.slice(i, i + batchSize);
        await Promise.allSettled(batch);
    }

    return loadedImages;
};

/**
 * Start pre-caching process
 * @param {Function} onProgress - Callback function for progress updates
 * @returns {Promise} - Resolves when caching is complete
 */
export const startPreCache = async (onProgress = () => { }) => {
    try {
        // Check if already cached
        if (!isFirstVisit()) {
            return { success: true, alreadyCached: true };
        }

        // Check network status
        if (!navigator.onLine) {
            throw new Error('Tidak ada koneksi internet');
        }

        const cachedItems = [];

        // Step 1: Cache Categories (0-10%)
        onProgress({
            percentage: 0,
            status: 'Memuat kategori berita...',
            itemsCached: 0,
        });

        try {
            // Use fetch directly to get Response object for caching
            const kategoriUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KATEGORI.LIST}`;
            const kategoriResponse = await fetch(kategoriUrl);

            if (!kategoriResponse.ok) {
                throw new Error(`HTTP error! status: ${kategoriResponse.status}`);
            }

            // Clone response before reading (can only read once)
            const kategoriResponseClone = kategoriResponse.clone();
            const kategoriFull = await kategoriResponse.json();
            const kategoriData = kategoriFull.data || [];
            cachedItems.push(...kategoriData);

            // Cache the cloned response in Service Worker cache
            if ('caches' in window) {
                const cache = await caches.open('vercel-api-cache');
                await cache.put(kategoriUrl, kategoriResponseClone);
            }

            onProgress({
                percentage: 10,
                status: `${kategoriData.length} kategori tersimpan`,
                itemsCached: kategoriFull.length,
            });
        } catch (error) {
            // Continue even if categories fail
            // Continue even if categories fail
        }

        // Step 2: Cache Latest News (10-40%)
        onProgress({
            percentage: 15,
            status: 'Memuat berita terbaru...',
            itemsCached: cachedItems.length,
        });

        try {
            const latestUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BERITA.LIST}?sort=newest&limit=30`;
            const latestResponse = await fetch(latestUrl);

            if (!latestResponse.ok) {
                throw new Error(`HTTP error! status: ${latestResponse.status}`);
            }

            const latestResponseClone = latestResponse.clone();
            const latestNews = await latestResponse.json();
            const latestData = latestNews.data || [];
            cachedItems.push(...latestData);

            // Cache to SW
            if ('caches' in window) {
                const cache = await caches.open('vercel-api-cache');
                await cache.put(latestUrl, latestResponseClone);
            }

            onProgress({
                percentage: 40,
                status: `${latestData.length} berita terbaru tersimpan`,
                itemsCached: cachedItems.length,
            });
        } catch (error) {
            // Continue even if latest news fail
        }

        // Step 3: Cache Popular News (40-70%)
        onProgress({
            percentage: 45,
            status: 'Memuat berita populer...',
            itemsCached: cachedItems.length,
        });

        try {
            const popularUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BERITA.POPULAR}?limit=30`;
            const popularResponse = await fetch(popularUrl);

            if (!popularResponse.ok) {
                throw new Error(`HTTP error! status: ${popularResponse.status}`);
            }

            const popularResponseClone = popularResponse.clone();
            const popularNews = await popularResponse.json();
            const popularData = popularNews.data || [];
            cachedItems.push(...popularData);

            // Cache to SW
            if ('caches' in window) {
                const cache = await caches.open('vercel-api-cache');
                await cache.put(popularUrl, popularResponseClone);
            }

            onProgress({
                percentage: 70,
                status: `${popularData.length} berita populer tersimpan`,
                itemsCached: cachedItems.length,
            });
        } catch (error) {
            // Continue even if popular news fail
        }

        // Step 4: Cache Featured News (70-85%)
        onProgress({
            percentage: 75,
            status: 'Memuat berita unggulan...',
            itemsCached: cachedItems.length,
        });

        try {
            const featuredUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BERITA.FEATURED}`;
            const featuredResponse = await fetch(featuredUrl);

            if (!featuredResponse.ok) {
                throw new Error(`HTTP error! status: ${featuredResponse.status}`);
            }

            const featuredResponseClone = featuredResponse.clone();
            const featuredNews = await featuredResponse.json();
            const featuredData = featuredNews.data || [];
            cachedItems.push(...featuredData);

            // Cache to SW
            if ('caches' in window) {
                const cache = await caches.open('vercel-api-cache');
                await cache.put(featuredUrl, featuredResponseClone);
            }

            onProgress({
                percentage: 85,
                status: `${featuredData.length} berita unggulan tersimpan`,
                itemsCached: cachedItems.length,
            });
        } catch (error) {
            // Continue even if featured news fail
        }

        // Step 4.5: Cache Article Details (85-90%)
        onProgress({
            percentage: 87,
            status: 'Menyimpan detail artikel...',
            itemsCached: cachedItems.length,
        });

        try {
            // Get all unique articles (remove duplicates)
            const uniqueArticles = Array.from(
                new Map(cachedItems.map(item => [item.id, item])).values()
            );

            // Cache first 10 article details
            const articlesToCache = uniqueArticles.slice(0, 10);
            let cachedArticles = 0;

            for (const article of articlesToCache) {
                try {
                    const articleUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BERITA.DETAIL(article.id)}`;
                    const articleResponse = await fetch(articleUrl);

                    if (articleResponse.ok) {
                        const articleResponseClone = articleResponse.clone();

                        // Cache to SW
                        if ('caches' in window) {
                            const cache = await caches.open('vercel-api-cache');
                            await cache.put(articleUrl, articleResponseClone);
                        }

                        cachedArticles++;
                    }
                } catch (error) {
                    // Continue with next article
                }
            }

            onProgress({
                percentage: 90,
                status: `${cachedArticles} detail artikel tersimpan`,
                itemsCached: cachedItems.length,
            });
        } catch (error) {
            // Continue even if article details fail
        }

        // Step 5: Preload Images (90-100%)
        onProgress({
            percentage: 90,
            status: 'Memuat gambar...',
            itemsCached: cachedItems.length,
        });

        // Get all unique articles (remove duplicates)
        const uniqueArticles = Array.from(
            new Map(cachedItems.map(item => [item.id, item])).values()
        );

        const imagesLoaded = await preloadImages(uniqueArticles, onProgress);

        // Step 6: Complete
        onProgress({
            percentage: 100,
            status: 'Selesai!',
            itemsCached: cachedItems.length,
        });

        // Save cache status
        saveCacheStatus({
            isComplete: true,
            totalItems: cachedItems.length,
            totalImages: imagesLoaded,
            completedAt: new Date().toISOString(),
        });

        return {
            success: true,
            totalItems: cachedItems.length,
            totalImages: imagesLoaded,
        };

    } catch (error) {
        // Save partial cache status
        saveCacheStatus({
            isComplete: false,
            error: error.message,
            failedAt: new Date().toISOString(),
        });

        throw error;
    }
};

/**
 * Refresh cache - clear and re-cache
 */
export const refreshCache = async (onProgress) => {
    await clearCache();
    return startPreCache(onProgress);
};

export default {
    isFirstVisit,
    getCacheStatus,
    startPreCache,
    clearCache,
    refreshCache,
};
