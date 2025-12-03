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
                count: response.pagination?.total || 0,
                page: response.pagination?.page || params.page || 1,
                limit: response.pagination?.limit || params.limit || 9,
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get berita by ID
     */
    getById: async (id, shouldSkipIncrement = false) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.DETAIL(id));

            // Only increment views if:
            // 1. We haven't already incremented (shouldSkipIncrement is false)
            // 2. User is logged in
            // 3. Online
            const token = apiClient.getToken();
            if (!shouldSkipIncrement && token && navigator.onLine) {
                try {
                    const incrementResponse = await apiClient.post(API_CONFIG.ENDPOINTS.BERITA.INCREMENT_VIEW(id));
                    // Update the view count with the response from increment API
                    if (incrementResponse.data?.views !== undefined) {
                        response.data.views = incrementResponse.data.views;
                    }
                } catch (viewsError) {
                    // Silently ignore views increment errors
                    console.warn('Failed to increment views:', viewsError);
                }
            }

            return { data: response.data };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get berita by slug
     */
    getBySlug: async (slug) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.BY_SLUG(slug));

            // Only increment views if user is logged in
            const token = apiClient.getToken();
            if (response.data && token && navigator.onLine) {
                try {
                    await apiClient.post(API_CONFIG.ENDPOINTS.BERITA.INCREMENT_VIEW(response.data.id));
                } catch (viewsError) {
                    // Silently ignore views increment errors
                }
            }

            return { data: response.data };
        } catch (error) {
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
                count: response.pagination?.total || 0,
                page: response.pagination?.page || params.page || 1,
                limit: response.pagination?.limit || params.limit || 9,
            };
        } catch (error) {
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
            return { data: [] };
        }
    },
};
