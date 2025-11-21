// src/index.js
require('dotenv').config();
const express = require('express');
const beritaRoutes = require('./routes/beritaRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (sederhana)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Berita - Server berjalan dengan baik',
    version: '1.0.0',
    endpoints: {
      berita: '/api/berita',
      kategori: '/api/kategori'
    }
  });
});

app.use('/api/berita', beritaRoutes);
app.use('/api/kategori', kategoriRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🚀 Server API Berita Berjalan           ║
║                                           ║
║   📡 Port: ${PORT}                           ║
║   🌐 URL: http://localhost:${PORT}           ║
║                                           ║
║   📋 Endpoints:                           ║
║   ├─ /api/berita                          ║
║   └─ /api/kategori                        ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});