import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import apiClient from '../services/apiClient';

// Create Auth Context
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages global authentication state using API-based JWT authentication
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Initialize auth state from stored token
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = apiClient.getToken();

                if (token) {
                    // Token exists, verify with API
                    try {
                        const { user: currentUser } = await authService.getCurrentUser();
                        setUser(currentUser);
                        setIsAdmin(currentUser?.role === 'admin');
                    } catch (error) {
                        // Token invalid or expired, clear it
                        console.error('Token verification failed:', error);
                        apiClient.clearToken();
                        setUser(null);
                        setIsAdmin(false);
                    }
                } else {
                    // No token, user not logged in
                    setUser(null);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /**
     * Sign up new user via API
     */
    const signUp = async (email, password, fullName) => {
        setLoading(true);
        try {
            const { user: newUser, token } = await authService.register(email, password, fullName);

            // Set user and admin status
            setUser(newUser);
            setIsAdmin(newUser?.role === 'admin');

            return { data: { user: newUser, token }, error: null };
        } catch (error) {
            console.error('Sign up error:', error);
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sign in user via API
     */
    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const { user: loggedInUser, token } = await authService.login(email, password);

            // Set user and admin status
            setUser(loggedInUser);
            setIsAdmin(loggedInUser?.role === 'admin');

            return { data: { user: loggedInUser, token }, error: null };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sign out user via API
     */
    const signOut = async () => {
        setLoading(true);
        try {
            await authService.logout();

            setUser(null);
            setIsAdmin(false);

            // Redirect to home
            window.location.hash = '/';

            return { error: null };
        } catch (error) {
            // Even if API call fails, clear local state
            setUser(null);
            setIsAdmin(false);
            console.error('Sign out error:', error);
            return { error };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update user profile via API
     */
    const updateProfile = async (data) => {
        try {
            const { user: updatedUser } = await authService.updateProfile(data);

            // Update local user state
            setUser(prev => ({
                ...prev,
                ...updatedUser
            }));

            return { data: updatedUser, error: null };
        } catch (error) {
            console.error('Update profile error:', error);
            return { data: null, error };
        }
    };

    const value = {
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
