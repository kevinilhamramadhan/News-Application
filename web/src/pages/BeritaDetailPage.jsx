import { useState, useEffect } from 'react';
import { Calendar, Star, Bookmark, Share2, ChevronLeft } from 'lucide-react';
import { useBeritaDetail } from '../hooks/useBerita';
import { useBookmark } from '../hooks/useBookmark';
import { formatDate, shareContent, getImageUrl } from '../utils/helpers';
import BeritaGrid from '../components/berita/BeritaGrid';
import Skeleton from '../components/common/Skeleton';
import Toast from '../components/common/Toast';

const BeritaDetailPage = ({ id }) => {
    const { berita, loading, error } = useBeritaDetail(id);
    const { bookmarks, toggleBookmark } = useBookmark();
    const [relatedBerita, setRelatedBerita] = useState([]);
    const [toast, setToast] = useState(null);

    const isBookmarked = bookmarks.includes(parseInt(id));

    const handleBookmarkToggle = async () => {
        try {
            const wasBookmarked = await toggleBookmark(parseInt(id));
            setToast({
                message: wasBookmarked ? 'Berita disimpan ke bookmark' : 'Berita dihapus dari bookmark',
                type: 'success',
            });
        } catch (error) {
            console.error('Bookmark toggle error:', error);
            setToast({
                message: 'Gagal menyimpan bookmark. Silakan login terlebih dahulu.',
                type: 'error',
            });
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

    if (error || !berita) {
        return (
            <div className="page-transition text-center py-12">
                <p className="text-red-600 text-lg">{error || 'Berita tidak ditemukan'}</p>
                <button
                    onClick={handleBack}
                    className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Kembali
                </button>
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

            {/* Main Image */}
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
                <img
                    src={getImageUrl(berita.gambar)}
                    alt={berita.judul}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <article className="max-w-4xl mx-auto">
                {/* Category */}
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
                    {berita.kategori?.nama || 'Umum'}
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {berita.judul}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(berita.createdAt || berita.tanggal)}</span>
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
