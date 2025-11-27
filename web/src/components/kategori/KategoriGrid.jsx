import KategoriCard from './KategoriCard';
import Skeleton from '../common/Skeleton';
import { AlertCircle } from 'lucide-react';

const KategoriGrid = ({ kategori, loading, error }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Skeleton variant="kategori" count={8} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100">
                            <AlertCircle className="w-10 h-10 text-red-600" strokeWidth={2} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Gagal Memuat Kategori
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {typeof error === 'string' ? error : 'Terjadi kesalahan saat memuat kategori'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition-all"
                    >
                        Coba Lagi
                    </button>
                </div>
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
