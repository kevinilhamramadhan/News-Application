import { useState, useEffect } from 'react';
import { ChevronLeft, Folder } from 'lucide-react';
import { useKategoriDetail } from '../hooks/useKategori';
import { useBookmark } from '../hooks/useBookmark';
import { beritaService } from '../services/beritaService';
import BeritaGrid from '../components/berita/BeritaGrid';
import Skeleton from '../components/common/Skeleton';

const KategoriDetailPage = ({ slug }) => {
    const { kategori, loading: loadingKategori, error: errorKategori } = useKategoriDetail(slug);
    const { bookmarks, toggleBookmark } = useBookmark();
    const [berita, setBerita] = useState([]);
    const [loadingBerita, setLoadingBerita] = useState(true);
    const [errorBerita, setErrorBerita] = useState(null);

    useEffect(() => {
        const fetchBerita = async () => {
            if (!kategori) return;

            try {
                setLoadingBerita(true);
                setErrorBerita(null);
                const response = await beritaService.getByKategori(kategori.id);
                setBerita(response.data.data || response.data);
            } catch (err) {
                setErrorBerita(err.message || 'Gagal memuat berita');
                setBerita([]);
            } finally {
                setLoadingBerita(false);
            }
        };

        fetchBerita();
    }, [kategori]);

    const handleBack = () => {
        window.location.hash = '/kategori';
    };

    const handleBookmarkToggle = (beritaId) => {
        toggleBookmark(beritaId);
    };

    if (loadingKategori) {
        return (
            <div className="page-transition">
                <div className="skeleton h-32 w-full rounded-lg mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton variant="card" count={6} />
                </div>
            </div>
        );
    }

    if (errorKategori || !kategori) {
        return (
            <div className="page-transition text-center py-12">
                <p className="text-red-600 text-lg">{errorKategori || 'Kategori tidak ditemukan'}</p>
                <button
                    onClick={handleBack}
                    className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Kembali ke Kategori
                </button>
            </div>
        );
    }

    return (
        <div className="page-transition">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <a href="#/kategori" className="hover:text-primary-600 transition-colors">
                    Kategori
                </a>
                <span>/</span>
                <span className="text-gray-900 font-medium">{kategori.nama}</span>
            </nav>

            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 mb-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Folder className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">{kategori.nama}</h1>
                </div>
                <p className="text-primary-100 mb-4">
                    {kategori.deskripsi || 'Berita dalam kategori ini'}
                </p>
                <div className="text-sm">
                    {kategori.jumlah_berita || kategori._count?.berita || berita.length} berita tersedia
                </div>
            </div>

            {/* Berita List */}
            <BeritaGrid
                berita={berita}
                loading={loadingBerita}
                error={errorBerita}
                onBookmarkToggle={handleBookmarkToggle}
                bookmarkedIds={bookmarks}
            />
        </div>
    );
};

export default KategoriDetailPage;
