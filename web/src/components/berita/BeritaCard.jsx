import { Calendar, Eye, Star, Bookmark } from 'lucide-react';
import { formatRelativeTime, truncateText, getImageUrl } from '../../utils/helpers';

const BeritaCard = ({ berita, onBookmarkToggle, isBookmarked = false }) => {
    const handleCardClick = () => {
        window.location.hash = `/berita/${berita.id}`;
    };

    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        onBookmarkToggle(berita.id);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getImageUrl(berita.gambar)}
                    alt={berita.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                />
                {/* Bookmark Button */}
                <button
                    onClick={handleBookmarkClick}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${isBookmarked
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                        }`}
                >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category Badge */}
                <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                        {berita.kategori?.nama || 'Umum'}
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
                            <span>{formatRelativeTime(berita.createdAt || berita.tanggal)}</span>
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
