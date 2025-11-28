import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

export const beritaService = {
    /**
     * Get all published berita with optional filters
     */
    getAll: async (params = {}) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.LIST, params);

            return {
                data: response.data || [],
                count: response.count || 0,
                page: response.page || 1,
                limit: response.limit || 9,
            };
        } catch (error) {
            console.error('Get all berita error:', error);
            throw error;
        }
    },

    /**
     * Get berita by ID
     */
    getById: async (id) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.DETAIL(id));

            // Increment views using API endpoint
            try {
                await apiClient.post(API_CONFIG.ENDPOINTS.BERITA.INCREMENT_VIEW(id));
                console.log(`✅ Views incremented for berita ID ${id}`);
            } catch (viewsError) {
                // Silently ignore views increment errors (e.g., when offline)
                console.log('⚠️ Views increment skipped:', viewsError.message);
            }

            return { data: response.data };
        } catch (error) {
            console.error('Get berita by ID error:', error);
            throw error;
        }
    },

    /**
     * Get berita by slug
     */
    getBySlug: async (slug) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.BY_SLUG(slug));

            // Increment views using API endpoint
            if (response.data) {
                try {
                    await apiClient.post(API_CONFIG.ENDPOINTS.BERITA.INCREMENT_VIEW(response.data.id));
                    console.log(`✅ Views incremented for berita "${response.data.judul}"`);
                } catch (viewsError) {
                    // Silently ignore views increment errors (e.g., when offline)
                    console.log('⚠️ Views increment skipped:', viewsError.message);
                }
            }

            return { data: response.data };
        } catch (error) {
            console.error('Get berita by slug error:', error);
            throw error;
        }
    },

    /**
     * Get popular berita (sorted by views)
     */
    getPopular: async (limit = 6) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.POPULAR, { limit });

            return { data: response.data || [] };
        } catch (error) {
            console.error('Get popular berita error:', error);
            throw error;
        }
    },

    /**
     * Get berita by kategori
     */
    getByKategori: async (kategoriId, params = {}) => {
        try {
            const response = await apiClient.get(
                API_CONFIG.ENDPOINTS.BERITA.BY_KATEGORI(kategoriId),
                params
            );

            return {
                data: response.data || [],
                count: response.count || 0,
                page: response.page || 1,
                limit: response.limit || 9,
            };
        } catch (error) {
            console.error('Get berita by kategori error:', error);
            throw error;
        }
    },

    /**
     * Get featured berita for homepage hero
     * Returns up to 5 featured news items
     */
    getFeatured: async () => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.FEATURED);

            return { data: response.data || [] };
        } catch (error) {
            console.error('Get featured berita error:', error);
            return { data: [] };
        }
    },
};
