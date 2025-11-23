// src/controllers/beritaController.js
const supabase = require('../config/supabaseClient');

// Get semua berita dengan filter dan pagination
const getAllBerita = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      kategori, 
      status = 'published',
      search 
    } = req.query;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('berita')
      .select(`
        *,
        kategori_berita:kategori_id (
          id,
          nama,
          slug
        )
      `, { count: 'exact' });

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by kategori
    if (kategori) {
      query = query.eq('kategori_id', kategori);
    }

    // Search by judul atau konten
    if (search) {
      query = query.or(`judul.ilike.%${search}%,konten.ilike.%${search}%`);
    }

    // Pagination dan sorting
    query = query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      },
      message: 'Berita berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita',
      error: error.message
    });
  }
};

// Get berita by ID
const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('berita')
      .select(`
        *,
        kategori_berita:kategori_id (
          id,
          nama,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan'
      });
    }

    // Increment views
    await supabase
      .from('berita')
      .update({ views: data.views + 1 })
      .eq('id', id);

    res.status(200).json({
      success: true,
      data: { ...data, views: data.views + 1 },
      message: 'Berita berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita',
      error: error.message
    });
  }
};

// Get berita by slug
const getBeritaBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data, error } = await supabase
      .from('berita')
      .select(`
        *,
        kategori_berita:kategori_id (
          id,
          nama,
          slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan'
      });
    }

    // Increment views
    await supabase
      .from('berita')
      .update({ views: data.views + 1 })
      .eq('slug', slug);

    res.status(200).json({
      success: true,
      data: { ...data, views: data.views + 1 },
      message: 'Berita berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita',
      error: error.message
    });
  }
};

// Get berita by kategori
const getBeritaByKategori = async (req, res) => {
  try {
    const { kategoriId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('berita')
      .select(`
        *,
        kategori_berita:kategori_id (
          id,
          nama,
          slug
        )
      `, { count: 'exact' })
      .eq('kategori_id', kategoriId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      },
      message: 'Berita berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita',
      error: error.message
    });
  }
};

// Get berita populer (berdasarkan views)
const getBeritaPopuler = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const { data, error } = await supabase
      .from('berita')
      .select(`
        *,
        kategori_berita:kategori_id (
          id,
          nama,
          slug
        )
      `)
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data,
      message: 'Berita populer berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil berita populer',
      error: error.message
    });
  }
};

// Create berita baru
const createBerita = async (req, res) => {
  try {
    const { 
      judul, 
      slug, 
      konten, 
      ringkasan, 
      gambar_url,
      penulis,
      kategori_id,
      status = 'draft'
    } = req.body;

    if (!judul || !slug || !konten) {
      return res.status(400).json({
        success: false,
        message: 'Judul, slug, dan konten wajib diisi'
      });
    }

    const insertData = {
      judul,
      slug,
      konten,
      ringkasan,
      gambar_url,
      penulis,
      kategori_id,
      status
    };

    // Set published_at jika status published
    if (status === 'published') {
      insertData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('berita')
      .insert([insertData])
      .select(`
        *,
        kategori_berita:kategori_id (
          id,
          nama,
          slug
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
      message: 'Berita berhasil dibuat'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat berita',
      error: error.message
    });
  }
};

// Update berita
const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      judul, 
      slug, 
      konten, 
      ringkasan, 
      gambar_url,
      penulis,
      kategori_id,
      status
    } = req.body;

    const updateData = {};
    if (judul) updateData.judul = judul;
    if (slug) updateData.slug = slug;
    if (konten) updateData.konten = konten;
    if (ringkasan !== undefined) updateData.ringkasan = ringkasan;
    if (gambar_url !== undefined) updateData.gambar_url = gambar_url;
    if (penulis) updateData.penulis = penulis;
    if (kategori_id !== undefined) updateData.kategori_id = kategori_id;
    if (status) {
      updateData.status = status;
      // Set published_at jika status berubah menjadi published
      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('berita')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        kategori_berita:kategori_id (
          id,
          nama,
          slug
        )
      `)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      message: 'Berita berhasil diupdate'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate berita',
      error: error.message
    });
  }
};

// Delete berita
const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('berita')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Berita berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus berita',
      error: error.message
    });
  }
};

module.exports = {
  getAllBerita,
  getBeritaById,
  getBeritaBySlug,
  getBeritaByKategori,
  getBeritaPopuler,
  createBerita,
  updateBerita,
  deleteBerita
};