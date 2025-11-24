import BeritaCard from './BeritaCard';
import Skeleton from '../common/Skeleton';

const BeritaGrid = ({ berita, loading, error, onBookmarkToggle, bookmarkedIds = [], requireAuth = false }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton variant="card" count={6} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    if (!berita || berita.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada berita ditemukan</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {berita.map((item) => (
                <BeritaCard
                    key={item.id}
                    berita={item}
                    onBookmarkToggle={onBookmarkToggle}
                    isBookmarked={bookmarkedIds.includes(item.id)}
                    requireAuth={requireAuth}
                />
            ))}
        </div>
    );
};

export default BeritaGrid;
