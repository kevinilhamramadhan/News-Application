import { useState, useEffect } from 'react';
import { ChevronLeft, Folder, AlertCircle } from 'lucide-react';
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
                // Check if error is due to network issue
                const isNetworkError = err.message?.includes('Network') ||
                    err.message?.includes('Failed to fetch') ||
                    !navigator.onLine;

                if (isNetworkError) {
                    setErrorBerita({
                        message: 'Anda sedang offline',
                        isOffline: true,
                        description: 'Data berita dalam kategori ini belum tersimpan di cache.'
                    });
                } else {
                    setErrorBerita({
                        message: err.message || 'Gagal memuat berita',
                        isOffline: false
                    });
                }
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
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100">
                            <AlertCircle className="w-10 h-10 text-red-600" strokeWidth={2} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Kategori Tidak Ditemukan
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {typeof errorKategori === 'string' ? errorKategori : 'Kategori yang Anda cari mungkin tidak ada atau telah dihapus.'}
                    </p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition-all"
                    >
                        Kembali ke Kategori
                    </button>
                </div>
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
