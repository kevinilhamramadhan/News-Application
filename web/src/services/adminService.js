import { supabase } from '../config/supabase';

/**
 * Admin Service
 * Handles admin-only operations for managing berita
 * All operations are protected by RLS policies on backend
 */
export const adminService = {
    /**
     * Create new berita (admin only)
     * @param {Object} data - Berita data
     * @returns {Promise} Created berita
     */
    createBerita: async (data) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data: berita, error } = await supabase
                .from('berita')
                .insert([{
                    judul: data.judul,
                    slug: data.slug || generateSlug(data.judul),
                    konten: data.konten,
                    ringkasan: data.ringkasan,
                    gambar_url: data.gambar_url,
                    kategori_id: data.kategori_id,
                    author_id: user.id,
                    status: data.status || 'draft',
                    is_featured: data.is_featured || false,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return { data: berita, error: null };
        } catch (error) {
            console.error('Create berita error:', error);
            return { data: null, error };
        }
    },

    /**
     * Update existing berita (admin only)
     * @param {string} id - Berita ID
     * @param {Object} data - Updated berita data
     * @returns {Promise} Updated berita
     */
    updateBerita: async (id, data) => {
        try {
            const updateData = {
                updated_at: new Date().toISOString()
            };

            if (data.judul) updateData.judul = data.judul;
            if (data.slug) updateData.slug = data.slug;
            if (data.konten) updateData.konten = data.konten;
            if (data.ringkasan) updateData.ringkasan = data.ringkasan;
            if (data.gambar_url) updateData.gambar_url = data.gambar_url;
            if (data.kategori_id) updateData.kategori_id = data.kategori_id;
            if (data.status) updateData.status = data.status;
            if (data.is_featured !== undefined) updateData.is_featured = data.is_featured;

            const { data: berita, error } = await supabase
                .from('berita')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data: berita, error: null };
        } catch (error) {
            console.error('Update berita error:', error);
            return { data: null, error };
        }
    },

    /**
     * Delete berita (admin only)
     * @param {string} id - Berita ID
     * @returns {Promise} Deletion result
     */
    deleteBerita: async (id) => {
        try {
            const { error } = await supabase
                .from('berita')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Delete berita error:', error);
            return { error };
        }
    },

    /**
     * Upload image to Supabase Storage
     * @param {File} file - Image file
     * @param {string} bucket - Storage bucket name
     * @returns {Promise} Public URL of uploaded image
     */
    uploadImage: async (file, bucket = 'berita-images') => {
        try {
            console.log('[uploadImage] Starting upload:', { fileName: file.name, fileSize: file.size, bucket });

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Add timeout to prevent hanging
            const uploadPromise = supabase.storage
                .from(bucket)
                .upload(filePath, file);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Upload timeout - bucket might not exist')), 10000)
            );

            const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]);

            if (uploadError) {
                console.error('[uploadImage] Upload error:', uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            console.log('[uploadImage] Upload successful:', publicUrl);
            return { url: publicUrl, error: null };
        } catch (error) {
            console.error('[uploadImage] Upload image error:', error);
            // Provide helpful error message
            if (error.message?.includes('timeout')) {
                return {
                    url: null,
                    error: new Error('Upload gagal: Bucket storage mungkin belum dibuat. Silakan buat bucket "berita-images" di Supabase Storage terlebih dahulu.')
                };
            }
            return { url: null, error };
        }
    },

    /**
     * Get all berita (admin can see all including drafts)
     * @param {Object} params - Query parameters
     * @returns {Promise} List of berita
     */
    getAllBerita: async (params = {}) => {
        try {
            let query = supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email)', { count: 'exact' })
                .order('created_at', { ascending: false });

            // Apply filters
            if (params.status && params.status !== 'all') {
                query = query.eq('status', params.status);
            }

            if (params.kategori_id) {
                query = query.eq('kategori_id', params.kategori_id);
            }

            if (params.search) {
                query = query.ilike('judul', `%${params.search}%`);
            }

            // Pagination
            if (params.limit) {
                const from = params.offset || 0;
                query = query.range(from, from + params.limit - 1);
            }

            const { data, error, count } = await query;

            if (error) throw error;
            return { data, count, error: null };
        } catch (error) {
            console.error('Get all berita error:', error);
            return { data: null, count: 0, error };
        }
    },

    /**
     * Get berita by ID (admin can see drafts)
     * @param {string} id - Berita ID
     * @returns {Promise} Berita data
     */
    getBeritaById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori:kategori_id(*), users!berita_author_id_fkey(full_name, email)')
                .eq('id', id)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get berita by ID error:', error);
            return { data: null, error };
        }
    },

    /**
     * Check featured news count and limit
     * @returns {Promise} Count and whether more can be added
     */
    checkFeaturedLimit: async () => {
        try {
            const { count, error } = await supabase
                .from('berita')
                .select('*', { count: 'exact', head: true })
                .eq('is_featured', true);

            if (error) throw error;

            return { count: count || 0, canAddMore: (count || 0) < 5, error: null };
        } catch (error) {
            console.error('Check featured limit error:', error);
            return { count: 0, canAddMore: false, error };
        }
    },

    /**
     * Toggle featured status for a berita
     * @param {string} id - Berita ID
     * @param {boolean} isFeatured - New featured status
     * @returns {Promise} Updated berita data
     */
    toggleFeatured: async (id, isFeatured) => {
        try {
            // If trying to set as featured, check limit first
            if (isFeatured) {
                const { count, canAddMore } = await adminService.checkFeaturedLimit();
                if (!canAddMore) {
                    return {
                        data: null,
                        error: { message: 'Maksimal 5 berita unggulan. Hapus salah satu untuk menambah yang baru.' }
                    };
                }
            }

            const { data, error } = await supabase
                .from('berita')
                .update({ is_featured: isFeatured })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Toggle featured error:', error);
            return { data: null, error };
        }
    },


    /**
     * Generate URL-friendly slug from title
     * @param {string} title - Berita title
     * @returns {string} URL slug
     */
    generateSlug: (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim();
    }
};

export default adminService;
