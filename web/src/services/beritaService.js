import { supabase } from '../config/supabase';

export const beritaService = {
    /**
     * Get all published berita with optional filters
     */
    getAll: async (params = {}) => {
        try {
            let query = supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email)', { count: 'exact' })
                .eq('status', 'published');

            // Apply filters if provided
            if (params.kategori_id) {
                query = query.eq('kategori_id', params.kategori_id);
            }

            if (params.search) {
                query = query.ilike('judul', `%${params.search}%`);
            }

            // Apply sorting
            if (params.sort === 'popular') {
                query = query.order('views', { ascending: false });
            } else if (params.sort === 'oldest') {
                query = query.order('created_at', { ascending: true });
            } else {
                // Default: newest
                query = query.order('created_at', { ascending: false });
            }

            // Pagination
            const page = params.page || 1;
            const limit = params.limit || 9;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                data: data || [],
                count: count || 0,
                page,
                limit,
            };
        } catch (error) {
            console.error('Get all berita error:', error);
            throw error;
        }
    },

    /**
     * Get berita by ID
     */
    getById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email, avatar_url)')
                .eq('id', id)
                .eq('status', 'published')
                .single();

            if (error) throw error;

            // Increment views using database function (more secure)
            if (data) {
                try {
                    const { error: rpcError } = await supabase
                        .rpc('increment_berita_views', { berita_id: id });

                    if (rpcError) {
                        console.error('❌ Views increment error:', rpcError.message);
                    } else {
                        console.log(`✅ Views incremented for berita ID ${id}`);
                    }
                } catch (viewsError) {
                    // Silently ignore views increment errors (e.g., when offline)
                    console.log('⚠️ Views increment skipped:', viewsError.message);
                }
            }

            return { data };
        } catch (error) {
            console.error('Get berita by ID error:', error);
            throw error;
        }
    },

    /**
     * Get berita by slug
     */
    getBySlug: async (slug) => {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email, avatar_url)')
                .eq('slug', slug)
                .eq('status', 'published')
                .single();

            if (error) throw error;

            // Increment views using database function (more secure)
            if (data) {
                try {
                    const { error: rpcError } = await supabase
                        .rpc('increment_berita_views', { berita_id: data.id });

                    if (rpcError) {
                        console.error('❌ Views increment error:', rpcError.message);
                    } else {
                        console.log(`✅ Views incremented for berita "${data.judul}"`);
                    }
                } catch (viewsError) {
                    // Silently ignore views increment errors (e.g., when offline)
                    console.log('⚠️ Views increment skipped:', viewsError.message);
                }
            }

            return { data };
        } catch (error) {
            console.error('Get berita by slug error:', error);
            throw error;
        }
    },

    /**
     * Get popular berita (sorted by views)
     */
    getPopular: async (limit = 6) => {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email)')
                .eq('status', 'published')
                .order('views', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { data: data || [] };
        } catch (error) {
            console.error('Get popular berita error:', error);
            throw error;
        }
    },

    /**
     * Get berita by kategori
     */
    getByKategori: async (kategoriId, params = {}) => {
        try {
            let query = supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email)', { count: 'exact' })
                .eq('kategori_id', kategoriId)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            // Pagination
            const page = params.page || 1;
            const limit = params.limit || 9;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                data: data || [],
                count: count || 0,
                page,
                limit,
            };
        } catch (error) {
            console.error('Get berita by kategori error:', error);
            throw error;
        }
    },

    /**
     * Get featured berita for homepage hero
     * Returns up to 5 featured news items
     */
    getFeatured: async () => {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email)')
                .eq('status', 'published')
                .eq('is_featured', true)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;

            return { data: data || [] };
        } catch (error) {
            console.error('Get featured berita error:', error);
            return { data: [] };
        }
    },
};
