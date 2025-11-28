import { useState, useEffect } from 'react';
import { Calendar, Star, Bookmark, Share2, ChevronLeft, Eye, WifiOff, AlertCircle } from 'lucide-react';
import { useBeritaDetail } from '../hooks/useBerita';
import { useBookmark } from '../hooks/useBookmark';
import { useAuth } from '../hooks/useAuth';
import { formatDate, shareContent, getImageUrl } from '../utils/helpers';
import BeritaGrid from '../components/berita/BeritaGrid';
import Skeleton from '../components/common/Skeleton';
import Toast from '../components/common/Toast';

const BeritaDetailPage = ({ id }) => {
    const { berita, loading, error } = useBeritaDetail(id);
    const { bookmarks, toggleBookmark } = useBookmark();
    const { isAdmin } = useAuth();
    const [relatedBerita, setRelatedBerita] = useState([]);
    const [toast, setToast] = useState(null);

    const isBookmarked = bookmarks.includes(id);

    const handleBookmarkToggle = async () => {
        try {
            const wasBookmarked = await toggleBookmark(id);
            setToast({
                message: wasBookmarked ? 'Berita disimpan ke bookmark' : 'Berita dihapus dari bookmark',
                type: 'success',
            });
        } catch (error) {
            console.error('Bookmark toggle error:', error);
            if (error.message === 'AUTH_REQUIRED') {
                setToast({
                    message: 'Silakan login terlebih dahulu untuk menyimpan bookmark.',
                    type: 'error',
                });
            } else {
                setToast({
                    message: 'Gagal menyimpan bookmark. Silakan coba lagi.',
                    type: 'error',
                });
            }
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        const success = await shareContent(berita.judul, berita.judul, url);
        if (success) {
            setToast({
                message: 'Link berhasil dibagikan',
                type: 'success',
            });
        } else {
            setToast({
                message: 'Gagal membagikan link',
                type: 'error',
            });
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="page-transition">
                <Skeleton variant="hero" count={1} />
                <div className="mt-8 max-w-4xl mx-auto">
                    <div className="skeleton h-8 w-64 mb-4 rounded"></div>
                    <div className="skeleton h-4 w-full mb-2 rounded"></div>
                    <div className="skeleton h-4 w-full mb-2 rounded"></div>
                    <div className="skeleton h-4 w-3/4 rounded"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        const isOfflineError = typeof error === 'object' && error.isOffline;
        const errorMessage = typeof error === 'string' ? error : error.message || 'Berita tidak ditemukan';
        const errorDescription = typeof error === 'object' ? error.description : null;

        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="mb-6">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isOfflineError
                                ? 'bg-gradient-to-br from-blue-100 to-cyan-100'
                                : 'bg-gradient-to-br from-red-100 to-orange-100'
                            }`}>
                            {isOfflineError ? (
                                <WifiOff className="w-10 h-10 text-blue-600" strokeWidth={2} />
                            ) : (
                                <AlertCircle className="w-10 h-10 text-red-600" strokeWidth={2} />
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {isOfflineError ? 'Maaf, Anda Sedang Offline' : errorMessage}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {isOfflineError
                            ? 'Konten tidak dapat diakses saat offline. Silakan sambungkan ke internet untuk membaca berita ini.'
                            : (errorDescription || 'Terjadi kesalahan saat memuat berita.')}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all ${isOfflineError
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                                    : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600'
                                }`}
                        >
                            Coba Lagi
                        </button>
                        <a
                            href="#/"
                            className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-center"
                        >
                            Ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-transition">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
                <span>Kembali</span>
            </button>

            {/* Article Container with consistent max-width */}
            <article className="max-w-4xl mx-auto">
                {/* Main Image */}
                <div className="relative h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
                    <img
                        src={getImageUrl(berita.gambar_url)}
                        alt={berita.judul}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Category */}
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
                    {berita.kategori?.nama || 'Umum'}
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {berita.judul}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(berita.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{berita.views || 0} views</span>
                    </div>
                    {berita.rating && (
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{berita.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-8">
                    {/* Only show bookmark button for non-admin users */}
                    {!isAdmin && (
                        <button
                            onClick={handleBookmarkToggle}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isBookmarked
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
                        </button>
                    )}
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                        <span>Bagikan</span>
                    </button>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-12">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {berita.konten}
                    </p>
                </div>

                {/* Related News */}
                {relatedBerita.length > 0 && (
                    <section className="border-t border-gray-200 pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Berita Terkait
                        </h2>
                        <BeritaGrid
                            berita={relatedBerita}
                            onBookmarkToggle={(id) => toggleBookmark(id)}
                            bookmarkedIds={bookmarks}
                            showBookmarkButton={!isAdmin}
                        />
                    </section>
                )}
            </article>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default BeritaDetailPage;
