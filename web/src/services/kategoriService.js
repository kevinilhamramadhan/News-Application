import { supabase } from '../config/supabase';

export const kategoriService = {
    /**
     * Get all kategori
     */
    getAll: async () => {
        try {
            // Get all categories
            const { data: categories, error: categoriesError } = await supabase
                .from('kategori')
                .select('*')
                .order('nama', { ascending: true });

            if (categoriesError) throw categoriesError;

            // For each category, count the published berita
            const categoriesWithCount = await Promise.all(
                (categories || []).map(async (kategori) => {
                    const { count, error: countError } = await supabase
                        .from('berita')
                        .select('*', { count: 'exact', head: true })
                        .eq('kategori_id', kategori.id)
                        .eq('status', 'published');

                    if (countError) {
                        console.error('Count error for kategori:', kategori.id, countError);
                    }

                    return {
                        ...kategori,
                        jumlah_berita: count || 0
                    };
                })
            );

            return { data: categoriesWithCount };
        } catch (error) {
            console.error('Get all kategori error:', error);
            throw error;
        }
    },

    /**
     * Get kategori by ID
     */
    getById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return { data };
        } catch (error) {
            console.error('Get kategori by ID error:', error);
            throw error;
        }
    },

    /**
     * Get kategori by slug
     */
    getBySlug: async (slug) => {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;

            return { data };
        } catch (error) {
            console.error('Get kategori by slug error:', error);
            throw error;
        }
    },
};
