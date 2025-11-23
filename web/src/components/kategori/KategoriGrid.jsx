import KategoriCard from './KategoriCard';
import Skeleton from '../common/Skeleton';

const KategoriGrid = ({ kategori, loading, error }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Skeleton variant="category" count={8} />
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

    if (!kategori || kategori.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada kategori ditemukan</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {kategori.map((item) => (
                <KategoriCard key={item.id} kategori={item} />
            ))}
        </div>
    );
};

export default KategoriGrid;
