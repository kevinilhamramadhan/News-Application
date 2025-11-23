// src/routes/beritaRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllBerita,
  getBeritaById,
  getBeritaBySlug,
  getBeritaByKategori,
  getBeritaPopuler,
  createBerita,
  updateBerita,
  deleteBerita
} = require('../controllers/beritaController');

// Routes untuk berita
router.get('/', getAllBerita);
router.get('/populer', getBeritaPopuler);
router.get('/kategori/:kategoriId', getBeritaByKategori);
router.get('/:id', getBeritaById);
router.get('/slug/:slug', getBeritaBySlug);
router.post('/', createBerita);
router.put('/:id', updateBerita);
router.delete('/:id', deleteBerita);

module.exports = router;