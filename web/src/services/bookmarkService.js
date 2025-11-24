import { supabase } from '../config/supabase';

/**
 * Bookmark Service
 * Handles user bookmarks stored in Supabase
 */
export const bookmarkService = {
    /**
     * Get all bookmarks for current user
     */
    async getUserBookmarks() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('bookmarks')
                .select('berita_id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { data: data || [] };
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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('bookmarks')
                .insert([{
                    user_id: user.id,
                    berita_id: beritaId
                }])
                .select()
                .single();

            if (error) {
                // Check if it's a duplicate error (already bookmarked)
                if (error.code === '23505') {
                    return { data: null, alreadyExists: true };
                }
                throw error;
            }

            return { data };
        } catch (error) {
            console.error('Add bookmark error:', error);
            throw error;
        }
    },

    /**
     * Remove a bookmark
     */
    async removeBookmark(beritaId) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user.id)
                .eq('berita_id', beritaId);

            if (error) throw error;

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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Check if bookmark exists
            const { data: existing, error: checkError } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('berita_id', beritaId)
                .maybeSingle();

            if (checkError) throw checkError;

            if (existing) {
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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { data, error } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('berita_id', beritaId)
                .maybeSingle();

            if (error) throw error;

            return !!data;
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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            let query = supabase
                .from('bookmarks')
                .select('berita_id, created_at, berita!inner(*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email))', { count: 'exact' })
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            // Pagination
            const page = params.page || 1;
            const limit = params.limit || 9;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            // Transform data to match berita structure
            const transformedData = (data || []).map(item => ({
                ...item.berita,
                bookmarked_at: item.created_at
            }));

            return {
                data: transformedData,
                count: count || 0,
                page,
                limit,
            };
        } catch (error) {
            console.error('Get bookmarked berita error:', error);
            throw error;
        }
    }
};
