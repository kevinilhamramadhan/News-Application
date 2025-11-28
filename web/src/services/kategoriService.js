import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

export const kategoriService = {
    /**
     * Get all kategori with berita count
     */
    getAll: async () => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.KATEGORI.LIST);

            return { data: response.data || [] };
        } catch (error) {
            console.error('Get all kategori error:', error);
            throw error;
        }
    },

    /**
     * Get kategori by ID
     */
    getById: async (id) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.KATEGORI.DETAIL(id));

            return { data: response.data };
        } catch (error) {
            console.error('Get kategori by ID error:', error);
            throw error;
        }
    },

    /**
     * Get kategori by slug
     * Note: API doesn't have slug endpoint yet, so we get all and filter
     */
    getBySlug: async (slug) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.KATEGORI.LIST);
            const kategori = (response.data || []).find(k => k.slug === slug);

            if (!kategori) {
                throw new Error('Kategori not found');
            }

            return { data: kategori };
        } catch (error) {
            console.error('Get kategori by slug error:', error);
            throw error;
        }
    },
};
