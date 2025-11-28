import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import { supabase } from '../config/supabase';

/**
 * Authentication Service
 * 
 * IMPORTANT: This service provides DUAL authentication modes:
 * 1. API-based JWT authentication (for future use)
 * 2. Supabase authentication (current/legacy - still in use)
 * 
 * The app currently uses Supabase auth, but this service provides
 * API auth methods for gradual migration.
 */
export const authService = {
    // ==================== API-BASED AUTH (JWT) ====================

    /**
     * Register via API (returns JWT token)
     */
    async registerViaAPI(email, password, fullName) {
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
            console.error('API Register error:', error);
            throw error;
        }
    },

    /**
     * Login via API (returns JWT token)
     */
    async loginViaAPI(email, password) {
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
            console.error('API Login error:', error);
            throw error;
        }
    },

    /**
     * Logout via API (clears JWT token)
     */
    async logoutViaAPI() {
        try {
            await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
            apiClient.clearToken();

            return { success: true };
        } catch (error) {
            // Even if API call fails, clear local token
            apiClient.clearToken();
            console.error('API Logout error:', error);
            throw error;
        }
    },

    /**
     * Get current user via API
     */
    async getCurrentUserViaAPI() {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
            return { user: response.data };
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    /**
     * Update user profile via API
     */
    async updateProfileViaAPI(updates) {
        try {
            const response = await apiClient.put(API_CONFIG.ENDPOINTS.AUTH.PROFILE, updates);
            return { user: response.data };
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    // ==================== SUPABASE AUTH (LEGACY/CURRENT) ====================

    /**
     * Register via Supabase (current method)
     */
    async register(email, password, fullName) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) throw error;
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('Supabase Register error:', error);
            throw error;
        }
    },

    /**
     * Login via Supabase (current method)
     */
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('Supabase Login error:', error);
            throw error;
        }
    },

    /**
     * Logout via Supabase (current method)
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Supabase Logout error:', error);
            throw error;
        }
    },

    /**
     * Get current user via Supabase (current method)
     */
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return { user };
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    /**
     * Get current session via Supabase
     */
    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session };
        } catch (error) {
            console.error('Get session error:', error);
            throw error;
        }
    },

    /**
     * Update user profile via Supabase
     */
    async updateProfile(updates) {
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: updates,
            });

            if (error) throw error;
            return { user: data.user };
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    /**
     * Listen to auth state changes (Supabase only)
     */
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },
};

export default authService;
