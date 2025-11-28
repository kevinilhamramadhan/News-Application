// src/services/apiClient.js
import axios from 'axios';

// API Base URL - from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://news-api-sepia-delta.vercel.app';

/**
 * API Client using Axios
 * Handles all HTTP requests to backend API
 */
class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 seconds
        });

        // Request interceptor - add auth token if available
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - handle errors globally
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle specific error cases
                if (error.response) {
                    // Server responded with error status
                    const { status, data } = error.response;

                    if (status === 401) {
                        // Unauthorized - clear token and redirect to login
                        this.clearToken();
                        // You can emit an event or use a state management solution here
                        console.error('Session expired. Please login again.');
                    }

                    // Return structured error
                    return Promise.reject({
                        status,
                        message: data.message || 'An error occurred',
                        data: data,
                    });
                } else if (error.request) {
                    // Request made but no response (network error)
                    return Promise.reject({
                        status: 0,
                        message: 'Network error. Please check your connection.',
                        isNetworkError: true,
                    });
                } else {
                    // Something else happened
                    return Promise.reject({
                        status: 0,
                        message: error.message || 'An unexpected error occurred',
                    });
                }
            }
        );
    }

    /**
     * Get stored authentication token
     */
    getToken() {
        return localStorage.getItem('auth_token');
    }

    /**
     * Store authentication token
     */
    setToken(token) {
        localStorage.setItem('auth_token', token);
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        localStorage.removeItem('auth_token');
    }

    /**
     * GET request
     */
    async get(url, params = {}) {
        try {
            const response = await this.client.get(url, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * POST request
     */
    async post(url, data = {}) {
        try {
            const response = await this.client.post(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * PUT request
     */
    async put(url, data = {}) {
        try {
            const response = await this.client.put(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * DELETE request
     */
    async delete(url) {
        try {
            const response = await this.client.delete(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
