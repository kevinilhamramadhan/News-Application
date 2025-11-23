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
                const response = await beritaService.getAll(params);
                setBerita(response.data.data || response.data);
                setPagination(response.data.pagination);
            } catch (err) {
                setError(err.message || 'Gagal memuat berita');
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
                const response = await beritaService.getById(id);
                setBerita(response.data.data || response.data);
            } catch (err) {
                setError(err.message || 'Gagal memuat detail berita');
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
                const response = await beritaService.getPopular(limit);
                setBerita(response.data.data || response.data);
            } catch (err) {
                setError(err.message || 'Gagal memuat berita populer');
                setBerita([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBerita();
    }, [limit]);

    return { berita, loading, error };
};
