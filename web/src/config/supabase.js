import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = 'Missing Supabase environment variables. Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY';
    console.error(errorMessage);
    throw new Error(errorMessage);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Auth state observer helper
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange(callback);
};

// Helper to manually refresh session
export const refreshSession = async () => {
    try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
            console.error('Manual session refresh error:', error);
            return { success: false, error };
        }
        console.log('✅ Session manually refreshed at', new Date().toLocaleTimeString());
        return { success: true, session: data.session };
    } catch (error) {
        console.error('Manual session refresh failed:', error);
        return { success: false, error };
    }
};

// Helper to get current session status
export const getSessionStatus = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
            return { exists: false, expiresAt: null };
        }

        return {
            exists: true,
            expiresAt: new Date(session.expires_at * 1000),
            expiresIn: Math.floor((session.expires_at * 1000 - Date.now()) / 1000 / 60), // minutes
            user: session.user
        };
    } catch (error) {
        console.error('Get session status error:', error);
        return { exists: false, expiresAt: null, error };
    }
};
