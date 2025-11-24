import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { onAuthStateChange } from '../config/supabase';

// Create Auth Context
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages global authentication state
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Initialize auth state
    useEffect(() => {
        // Check for existing session
        const initAuth = async () => {
            try {
                const { user: currentUser } = await authService.getCurrentUser();

                if (currentUser) {
                    setUser(currentUser);
                    setIsAdmin(currentUser?.role === 'admin');
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Init auth error:', error);
                setUser(null);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth state changes
        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                const { user: currentUser } = await authService.getCurrentUser();
                setUser(currentUser);
                setIsAdmin(currentUser?.role === 'admin');
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsAdmin(false);
            }
        });

        // Cleanup subscription
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    /**
     * Sign up new user
     */
    const signUp = async (email, password, fullName) => {
        setLoading(true);
        try {
            const { data, error } = await authService.signUp(email, password, fullName);
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sign in user
     */
    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await authService.signIn(email, password);
            if (error) throw error;

            // Fetch user profile
            const { user: currentUser } = await authService.getCurrentUser();
            setUser(currentUser);
            setIsAdmin(currentUser?.role === 'admin');

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sign out user
     */
    const signOut = async () => {
        setLoading(true);
        try {
            const { error } = await authService.signOut();
            if (error) throw error;

            setUser(null);
            setIsAdmin(false);

            // Redirect to home
            window.location.hash = '/';

            return { error: null };
        } catch (error) {
            return { error };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update user profile
     */
    const updateProfile = async (data) => {
        try {
            const { data: profile, error } = await authService.updateProfile(data);
            if (error) throw error;

            // Update local user state
            setUser(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    ...profile
                }
            }));

            return { data: profile, error: null };
        } catch (error) {
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
