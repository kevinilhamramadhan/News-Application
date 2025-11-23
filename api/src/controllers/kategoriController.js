// src/controllers/kategoriController.js
const supabase = require('../config/supabaseClient');

// Get semua kategori
const getAllKategori = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('kategori_berita')
      .select('*')
      .order('nama', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data,
      message: 'Kategori berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kategori',
      error: error.message
    });
  }
};

// Get kategori by ID
const getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('kategori_berita')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      message: 'Kategori berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kategori',
      error: error.message
    });
  }
};

// Get kategori by slug
const getKategoriBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data, error } = await supabase
      .from('kategori_berita')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      message: 'Kategori berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kategori',
      error: error.message
    });
  }
};

// Create kategori baru
const createKategori = async (req, res) => {
  try {
    const { nama, slug, deskripsi } = req.body;

    if (!nama || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan slug wajib diisi'
      });
    }

    const { data, error } = await supabase
      .from('kategori_berita')
      .insert([{ nama, slug, deskripsi }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
      message: 'Kategori berhasil dibuat'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat kategori',
      error: error.message
    });
  }
};

// Update kategori
const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, slug, deskripsi } = req.body;

    const updateData = {};
    if (nama) updateData.nama = nama;
    if (slug) updateData.slug = slug;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi;

    const { data, error } = await supabase
      .from('kategori_berita')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      message: 'Kategori berhasil diupdate'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate kategori',
      error: error.message
    });
  }
};

// Delete kategori
const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('kategori_berita')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kategori',
      error: error.message
    });
  }
};

module.exports = {
  getAllKategori,
  getKategoriById,
  getKategoriBySlug,
  createKategori,
  updateKategori,
  deleteKategori
};