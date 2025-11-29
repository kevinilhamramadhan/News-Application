import { useState, useEffect } from 'react';
import { kategoriService } from '../services/kategoriService';

export const useKategori = () => {
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await kategoriService.getAll();
                setKategori(response.data || []);
            } catch (err) {
                // Check if error is due to network issue
                const isNetworkError = err.message?.includes('Network') ||
                    err.message?.includes('Failed to fetch') ||
                    !navigator.onLine;

                if (isNetworkError) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Data kategori belum tersimpan di cache. Silakan sambungkan ke internet untuk melihat kategori.'
                    });
                } else {
                    setError({
                        message: err.message || 'Gagal memuat kategori',
                        isOffline: false
                    });
                }
                setKategori([]);
            } finally {
                setLoading(false);
            }
        };

        fetchKategori();
    }, []);

    return { kategori, loading, error };
};

export const useKategoriDetail = (slug) => {
    const [kategori, setKategori] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKategori = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const response = await kategoriService.getBySlug(slug);
                setKategori(response.data || null);
            } catch (err) {
                // Check if error is due to network issue
                const isNetworkError = err.message?.includes('Network') ||
                    err.message?.includes('Failed to fetch') ||
                    !navigator.onLine;

                if (isNetworkError) {
                    setError({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Kategori ini belum tersimpan di cache. Sambungkan ke internet untuk melihat kategori ini.'
                    });
                } else {
                    setError({
                        message: err.message || 'Gagal memuat detail kategori',
                        isOffline: false
                    });
                }
                setKategori(null);
            } finally {
                setLoading(false);
            }
        };

        fetchKategori();
    }, [slug]);

    return { kategori, loading, error };
};
