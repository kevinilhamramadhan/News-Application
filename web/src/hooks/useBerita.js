import { useState, useEffect } from 'react';
import { beritaService } from '../services/beritaService';

export const useBerita = (params = {}) => {
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        const fetchBerita = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if offline before fetching
                if (!navigator.onLine) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Data berita tidak tersedia saat offline. Silakan coba lagi ketika koneksi internet tersambung.'
                    });
                    setBerita([]);
                    setLoading(false);
                    return;
                }

                const response = await beritaService.getAll(params);
                // beritaService.getAll returns { data, count, page, limit }
                setBerita(response.data || []);
                // Build pagination from response
                setPagination({
                    currentPage: response.page,
                    totalPages: Math.ceil((response.count || 0) / (response.limit || 1)),
                    total: response.count,
                    limit: response.limit
                });
            } catch (err) {
                // Check if error is due to network issue
                const isNetworkError = err.message?.includes('Network') ||
                    err.message?.includes('Failed to fetch') ||
                    !navigator.onLine;

                if (isNetworkError) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Data berita ini belum tersimpan di cache. Silakan sambungkan ke internet untuk melihat berita terbaru.'
                    });
                } else {
                    setError({
                        message: err.message || 'Gagal memuat berita',
                        isOffline: false
                    });
                }
                setBerita([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBerita();
    }, [JSON.stringify(params)]);

    return { berita, loading, error, pagination };
};

export const useBeritaDetail = (id) => {
    const [berita, setBerita] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBerita = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                // Check if offline before fetching
                if (!navigator.onLine) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Berita ini belum tersimpan di cache. Untuk membaca berita ini, silakan sambungkan ke internet terlebih dahulu.'
                    });
                    setBerita(null);
                    setLoading(false);
                    return;
                }

                const response = await beritaService.getById(id);
                // beritaService.getById returns { data }
                setBerita(response.data || null);
            } catch (err) {
                // Check if error is due to network issue
                const isNetworkError = err.message?.includes('Network') ||
                    err.message?.includes('Failed to fetch') ||
                    !navigator.onLine;

                if (isNetworkError) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Berita ini belum pernah Anda buka sebelumnya, sehingga tidak tersedia secara offline. Sambungkan ke internet untuk membaca berita ini.'
                    });
                } else {
                    setError({
                        message: err.message || 'Gagal memuat detail berita',
                        isOffline: false
                    });
                }
                setBerita(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBerita();
    }, [id]);

    return { berita, loading, error };
};

export const useBeritaPopular = (limit = 6) => {
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBerita = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if offline before fetching
                if (!navigator.onLine) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Data berita populer tidak tersedia saat offline.'
                    });
                    setBerita([]);
                    setLoading(false);
                    return;
                }

                const response = await beritaService.getPopular(limit);
                // beritaService.getPopular returns { data }
                setBerita(response.data || []);
            } catch (err) {
                // Check if error is due to network issue
                const isNetworkError = err.message?.includes('Network') ||
                    err.message?.includes('Failed to fetch') ||
                    !navigator.onLine;

                if (isNetworkError) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Data berita populer tidak tersedia saat offline. Silakan coba lagi ketika koneksi tersambung.'
                    });
                } else {
                    setError({
                        message: err.message || 'Gagal memuat berita populer',
                        isOffline: false
                    });
                }
                setBerita([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBerita();
    }, [limit]);

    return { berita, loading, error };
};
