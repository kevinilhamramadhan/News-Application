// src/routes/kategoriRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllKategori,
  getKategoriById,
  getKategoriBySlug,
  createKategori,
  updateKategori,
  deleteKategori
} = require('../controllers/kategoriController');

// Routes untuk kategori
router.get('/', getAllKategori);
router.get('/:id', getKategoriById);
router.get('/slug/:slug', getKategoriBySlug);
router.post('/', createKategori);
router.put('/:id', updateKategori);
router.delete('/:id', deleteKategori);

module.exports = router;