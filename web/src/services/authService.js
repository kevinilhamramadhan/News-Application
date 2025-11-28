import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Authentication Service - API-Only Version
 * Handles all authentication operations via backend API
 * Uses JWT token authentication
 */
export const authService = {
    /**
     * Register new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} fullName - User full name
     * @returns {Promise} User data and token
     */
    async register(email, password, fullName) {
        try {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
                email,
                password,
                full_name: fullName,
            });

            // Extract data from API response
            const { user, token } = response.data;

            // Store JWT token
            if (token) {
                apiClient.setToken(token);
            }

            return { user, token };
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} User data and token
     */
    async login(email, password) {
        try {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
                email,
                password,
            });

            // Extract data from API response
            const { user, token } = response.data;

            // Store JWT token
            if (token) {
                apiClient.setToken(token);
            }

            return { user, token };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     * Clears JWT token from local storage
     * @returns {Promise} Success status
     */
    async logout() {
        try {
            await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
            apiClient.clearToken();

            return { success: true };
        } catch (error) {
            // Even if API call fails, clear local token
            apiClient.clearToken();
            console.error('Logout error:', error);
            throw error;
        }
    },

    /**
     * Get current user from server
     * Uses stored JWT token
     * @returns {Promise} Current user data
     */
    async getCurrentUser() {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
            return { user: response.data };
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    /**
     * Update user profile
     * @param {Object} updates - Profile updates (full_name, avatar_url, etc.)
     * @returns {Promise} Updated user data
     */
    async updateProfile(updates) {
        try {
            const response = await apiClient.put(API_CONFIG.ENDPOINTS.AUTH.PROFILE, updates);
            return { user: response.data };
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },
};

export default authService;
