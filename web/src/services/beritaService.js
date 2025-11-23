import api from './api';

export const beritaService = {
    getAll: (params) => api.get('/berita', { params }),

    getById: (id) => api.get(`/berita/${id}`),

    getBySlug: (slug) => api.get(`/berita/slug/${slug}`),

    getPopular: (limit = 6) => api.get('/berita/populer', { params: { limit } }),

    getByKategori: (kategoriId, params) =>
        api.get(`/berita/kategori/${kategoriId}`, { params }),
};
