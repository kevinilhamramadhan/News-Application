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
                setKategori(response.data.data || response.data);
            } catch (err) {
                setError(err.message || 'Gagal memuat kategori');
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
                setKategori(response.data.data || response.data);
            } catch (err) {
                setError(err.message || 'Gagal memuat detail kategori');
                setKategori(null);
            } finally {
                setLoading(false);
            }
        };

        fetchKategori();
    }, [slug]);

    return { kategori, loading, error };
};
