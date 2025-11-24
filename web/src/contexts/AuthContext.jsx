import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { onAuthStateChange, supabase } from '../config/supabase';

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
        // Listen for auth state changes - this automatically handles initial session
        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            if (event === 'INITIAL_SESSION') {
                // Handle initial session on page load
                if (session?.user) {
                    try {
                        // Fetch user profile from database
                        const { data: profile } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();

                        const userData = {
                            ...session.user,
                            profile: profile || null,
                            role: profile?.role || 'user'
                        };

                        setUser(userData);
                        setIsAdmin(userData.role === 'admin');
                    } catch (error) {
                        // Set user without profile if error
                        setUser({
                            ...session.user,
                            profile: null,
                            role: 'user'
                        });
                        setIsAdmin(false);
                    }
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
                setLoading(false);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                    try {
                        // Fetch user profile with longer timeout
                        const { data: profile, error: profileError } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();

                        if (profileError) {
                            console.error('Profile fetch error:', profileError);
                        }

                        const userData = {
                            ...session.user,
                            profile: profile || null,
                            role: profile?.role || 'user'
                        };

                        setUser(userData);
                        setIsAdmin(userData.role === 'admin');
                    } catch (error) {
                        console.error('Error setting user:', error);
                        // Set user with auth data even if profile fails
                        const userData = {
                            ...session.user,
                            profile: null,
                            role: 'user'
                        };
                        setUser(userData);
                        setIsAdmin(false);
                    }
                }
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
