import { supabase } from '../config/supabase';

/**
 * Authentication Service
 * Handles all authentication operations with Supabase
 */
export const authService = {
    /**
     * Register a new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} fullName - User full name
     * @returns {Promise} Supabase auth response
     */
    signUp: async (email, password, fullName) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'user' // Default role
                    }
                }
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Sign up error:', error);
            return { data: null, error };
        }
    },

    /**
     * Sign in existing user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Supabase auth response
     */
    signIn: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error };
        }
    },

    /**
     * Sign out current user
     * @returns {Promise} Supabase auth response
     */
    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Sign out error:', error);
            return { error };
        }
    },

    /**
     * Get current authenticated user with profile
     * @returns {Promise} User object with profile data
     */
    getCurrentUser: async () => {
        try {
            // Get auth user
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError) throw authError;
            if (!user) return { user: null, error: null };

            // Get user profile from users table
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                // Return user without profile if profile doesn't exist yet
                return {
                    user: {
                        ...user,
                        profile: null,
                        role: 'user'
                    },
                    error: null
                };
            }

            return {
                user: {
                    ...user,
                    profile,
                    role: profile?.role || 'user'
                },
                error: null
            };
        } catch (error) {
            console.error('Get current user error:', error);
            return { user: null, error };
        }
    },

    /**
     * Update user profile
     * @param {Object} data - Profile data to update
     * @returns {Promise} Updated profile
     */
    updateProfile: async (data) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user');

            const { data: profile, error } = await supabase
                .from('users')
                .update({
                    full_name: data.full_name,
                    avatar_url: data.avatar_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            return { data: profile, error: null };
        } catch (error) {
            console.error('Update profile error:', error);
            return { data: null, error };
        }
    },

    /**
     * Check if current user is admin
     * @returns {Promise<boolean>} True if user is admin
     */
    checkRole: async () => {
        try {
            const { user } = await authService.getCurrentUser();
            return user?.role === 'admin';
        } catch (error) {
            console.error('Check role error:', error);
            return false;
        }
    },

    /**
     * Get current session
     * @returns {Promise} Current session
     */
    getSession: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session, error: null };
        } catch (error) {
            console.error('Get session error:', error);
            return { session: null, error };
        }
    }
};
