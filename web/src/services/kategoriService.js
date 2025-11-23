import api from './api';

export const kategoriService = {
    getAll: () => api.get('/kategori'),

    getById: (id) => api.get(`/kategori/${id}`),

    getBySlug: (slug) => api.get(`/kategori/slug/${slug}`),
};
