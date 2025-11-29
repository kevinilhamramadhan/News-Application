import { useState } from 'react';
import { Calendar, Star, Bookmark, Eye, Image as ImageIcon } from 'lucide-react';
import { formatRelativeTime, truncateText, getImageUrl } from '../../utils/helpers';
import { useAuthModal } from '../../hooks/useAuthModal';

const BeritaCard = ({ berita, onBookmarkToggle, isBookmarked = false, requireAuth = false, showBookmarkButton = true }) => {
    const [imageError, setImageError] = useState(false);
    const { openLoginModal } = useAuthModal();

    const handleCardClick = () => {
        window.location.hash = `/berita/${berita.id}`;
    };

    const handleBookmarkClick = async (e) => {
        e.stopPropagation();

        // If bookmark requires auth and user clicks, show modal
        if (requireAuth) {
            openLoginModal();
            return;
        }

        try {
            await onBookmarkToggle(berita.id);
        } catch (error) {
            console.error('Bookmark error:', error);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                {!imageError && berita.gambar_url ? (
                    <img
                        src={getImageUrl(berita.gambar_url)}
                        alt={berita.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500">
                        <ImageIcon className="w-16 h-16 mb-2" />
                        <p className="text-sm font-medium">Tidak ada gambar</p>
                    </div>
                )}

                {/* Bookmark Button - Only show if showBookmarkButton is true */}
                {showBookmarkButton && (
                    <button
                        onClick={handleBookmarkClick}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${isBookmarked
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                            }`}
                        title={requireAuth ? 'Login untuk bookmark' : isBookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category Badge */}
                <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                        {berita.kategori_berita?.nama || berita.kategori?.nama || 'Umum'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {berita.judul}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {truncateText(berita.konten || berita.ringkasan, 120)}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatRelativeTime(berita.created_at || berita.createdAt || berita.tanggal)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{berita.views || 0}</span>
                        </div>
                    </div>
                    {berita.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{berita.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeritaCard;
