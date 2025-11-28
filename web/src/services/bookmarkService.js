import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Bookmark Service (API-based)
 * Handles user bookmarks via API endpoints
 */
export const bookmarkService = {
    /**
     * Get all bookmarks for current user
     */
    async getUserBookmarks() {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOOKMARKS.LIST);

            return { data: response.data || [] };
        } catch (error) {
            console.error('Get bookmarks error:', error);
            throw error;
        }
    },

    /**
     * Add a bookmark
     */
    async addBookmark(beritaId) {
        try {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.BOOKMARKS.ADD(beritaId));

            return { data: response.data };
        } catch (error) {
            // Check if it's a duplicate error (already bookmarked)
            if (error.status === 400 && error.message?.includes('already bookmarked')) {
                return { data: null, alreadyExists: true };
            }
            console.error('Add bookmark error:', error);
            throw error;
        }
    },

    /**
     * Remove a bookmark
     */
    async removeBookmark(beritaId) {
        try {
            await apiClient.delete(API_CONFIG.ENDPOINTS.BOOKMARKS.REMOVE(beritaId));

            return { success: true };
        } catch (error) {
            console.error('Remove bookmark error:', error);
            throw error;
        }
    },

    /**
     * Toggle bookmark (add if not exists, remove if exists)
     */
    async toggleBookmark(beritaId) {
        try {
            // Check if bookmark exists
            const isBookmarked = await this.isBookmarked(beritaId);

            if (isBookmarked) {
                // Remove bookmark
                await this.removeBookmark(beritaId);
                return { isBookmarked: false };
            } else {
                // Add bookmark
                await this.addBookmark(beritaId);
                return { isBookmarked: true };
            }
        } catch (error) {
            console.error('Toggle bookmark error:', error);
            throw error;
        }
    },

    /**
     * Check if a berita is bookmarked
     */
    async isBookmarked(beritaId) {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOOKMARKS.CHECK(beritaId));

            return response.isBookmarked || false;
        } catch (error) {
            console.error('Check bookmark error:', error);
            return false;
        }
    },

    /**
     * Get bookmarked berita with full details
     */
    async getBookmarkedBerita(params = {}) {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOOKMARKS.LIST, params);

            return {
                data: response.data || [],
                count: response.count || 0,
                page: response.page || 1,
                limit: response.limit || 9,
            };
        } catch (error) {
            console.error('Get bookmarked berita error:', error);
            throw error;
        }
    }
};

export default bookmarkService;
