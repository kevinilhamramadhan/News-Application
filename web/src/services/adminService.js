import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Admin Service - API-Only Version
 * Handles admin-only operations via backend API
 * All operations require admin authentication
 */
export const adminService = {
    /**
     * Upload image to server
     * @param {File} file - Image file
     * @param {string} bucket - Storage bucket name (optional)
     * @returns {Promise} Upload result with public URL
     */
    uploadImage: async (file, bucket = 'berita-images') => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('bucket', bucket);

            const response = await apiClient.postFormData('/upload', formData);

            return {
                url: response.data.url,
                error: null
            };
        } catch (error) {
            console.error('Upload image error:', error);
            return {
                url: null,
                error: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Create new berita (admin only)
     * @param {Object} data - Berita data
     * @returns {Promise} Created berita
     */
    createBerita: async (data) => {
        try {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.BERITA.LIST, data);
            return { data: response.data, error: null };
        } catch (error) {
            console.error('Create berita error:', error);
            return {
                data: null,
                error: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Update existing berita (admin only)
     * @param {string} id - Berita ID
     * @param {Object} data - Updated berita data
     * @returns {Promise} Updated berita
     */
    updateBerita: async (id, data) => {
        try {
            const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.BERITA.LIST}/${id}`, data);
            return { data: response.data, error: null };
        } catch (error) {
            console.error('Update berita error:', error);
            return {
                data: null,
                error: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Delete berita (admin only)
     * @param {string} id - Berita ID
     * @returns {Promise} Deletion result
     */
    deleteBerita: async (id) => {
        try {
            await apiClient.delete(`${API_CONFIG.ENDPOINTS.BERITA.LIST}/${id}`);
            return { error: null };
        } catch (error) {
            console.error('Delete berita error:', error);
            return {
                error: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Get all berita (admin can see all including drafts)
     * @param {Object} params - Query parameters
     * @returns {Promise} List of berita
     */
    getAllBerita: async (params = {}) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.LIST, params);

            return {
                data: response.data || [],
                count: response.pagination?.total || 0,
                error: null
            };
        } catch (error) {
            console.error('Get all berita error:', error);
            return {
                data: [],
                count: 0,
                error: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Get berita by ID (admin can see drafts)
     * @param {string} id - Berita ID
     * @returns {Promise} Berita data
     */
    getBeritaById: async (id) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BERITA.DETAIL(id));
            return { data: response.data, error: null };
        } catch (error) {
            console.error('Get berita by ID error:', error);
            return {
                data: null,
                error: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Toggle featured status for a berita
     * Note: Backend should handle featured limit logic
     * @param {string} id - Berita ID
     * @param {boolean} isFeatured - New featured status
     * @returns {Promise} Updated berita data
     */
    toggleFeatured: async (id, isFeatured) => {
        try {
            const response = await apiClient.put(
                `${API_CONFIG.ENDPOINTS.BERITA.LIST}/${id}`,
                { is_featured: isFeatured }
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error('Toggle featured error:', error);
            return {
                data: null,
                error: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Generate URL-friendly slug from title
     * @param {string} title - Berita title
     * @returns {string} URL slug
     */
    generateSlug: (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim();
    }
};

export default adminService;
