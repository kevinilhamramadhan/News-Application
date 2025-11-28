// Supabase Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;
let onAuthStateChange;

// If no credentials, create a dummy client (app now uses API instead)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not found - using API-only mode');

    // Dummy client to prevent crashes (not used in API-only mode)
    supabase = {
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            signOut: () => Promise.resolve({ error: null }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            refreshSession: () => Promise.resolve({ data: { session: null }, error: null }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: null })
                })
            })
        }),
    };

    onAuthStateChange = supabase.auth.onAuthStateChange;
} else {
    // Normal Supabase client (legacy, only for admin features)
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });

    onAuthStateChange = (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    };
}

export { supabase, onAuthStateChange };

// Helper to manually refresh session
export const refreshSession = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Supabase not configured' };
    }

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
    if (!supabaseUrl || !supabaseAnonKey) {
        return { exists: false, expiresAt: null };
    }

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
