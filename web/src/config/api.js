// src/config/api.js
/**
 * API Configuration
 */
export const API_CONFIG = {
    BASE_URL: 'https://news-api-sepia-delta.vercel.app',
    TIMEOUT: 10000,
    ENDPOINTS: {
        // Auth
        AUTH: {
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register',
            LOGOUT: '/api/auth/logout',
            ME: '/api/auth/me',
            PROFILE: '/api/auth/profile',
        },
        // Berita
        BERITA: {
            LIST: '/api/berita',
            DETAIL: (id) => `/api/berita/${id}`,
            BY_SLUG: (slug) => `/api/berita/slug/${slug}`,
            FEATURED: '/api/berita/featured',
            POPULAR: '/api/berita/populer',
            BY_KATEGORI: (kategoriId) => `/api/berita/kategori/${kategoriId}`,
            INCREMENT_VIEW: (id) => `/api/berita/${id}/view`,
        },
        // Kategori
        KATEGORI: {
            LIST: '/api/kategori',
            DETAIL: (id) => `/api/kategori/${id}`,
        },
        // Bookmarks
        BOOKMARKS: {
            LIST: '/api/bookmarks',
            ADD: (beritaId) => `/api/bookmarks/${beritaId}`,
            REMOVE: (beritaId) => `/api/bookmarks/${beritaId}`,
            CHECK: (beritaId) => `/api/bookmarks/check/${beritaId}`,
        },
        // Upload
        UPLOAD: '/api/upload',
    },
};

export default API_CONFIG;
