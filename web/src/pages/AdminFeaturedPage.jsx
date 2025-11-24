import { useState, useEffect } from 'react';
import { Star, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import { supabase } from '../config/supabase';
import { getImageUrl, formatRelativeTime } from '../utils/helpers';
import Toast from '../components/common/Toast';

/**
 * AdminFeaturedPage - Manage featured news (max 5)
 */
const AdminFeaturedPage = () => {
    const [allBerita, setAllBerita] = useState([]);
    const [featuredBerita, setFeaturedBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);
    const [featuredCount, setFeaturedCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all published berita
            const { data } = await adminService.getAllBerita({ status: 'published' });
            setAllBerita(data || []);

            // Filter featured
            const featured = (data || []).filter(b => b.is_featured);
            setFeaturedBerita(featured);
            setFeaturedCount(featured.length);
        } catch (error) {
            console.error('Fetch data error:', error);
            setToast({ message: 'Gagal memuat data', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeatured = async (id, currentStatus) => {
        const newStatus = !currentStatus;

        try {
            const { data, error } = await adminService.toggleFeatured(id, newStatus);

            if (error) {
                setToast({ message: error.message || 'Gagal mengubah status', type: 'error' });
                return;
            }

            // Refresh data
            await fetchData();
            setToast({
                message: newStatus ? 'Berhasil menandai sebagai unggulan' : 'Berhasil menghapus dari unggulan',
                type: 'success'
            });
        } catch (error) {
            setToast({ message: 'Gagal mengubah status', type: 'error' });
        }
    };

    const filteredBerita = allBerita.filter(b =>
        b.judul.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Berita Unggulan</h1>
                    <p className="text-gray-600 mt-1">Tandai hingga 5 berita untuk ditampilkan di carousel homepage</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
                    <Star className="w-5 h-5 text-primary-600 fill-current" />
                    <span className="font-semibold text-primary-900">
                        {featuredCount}/5 Berita Unggulan
                    </span>
                </div>
            </div>

            {/* Warning */}
            {featuredCount >= 5 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-yellow-900">Batas Maksimal Tercapai</p>
                        <p className="text-sm text-yellow-700 mt-1">
                            Anda sudah menandai 5 berita unggulan. Hapus salah satu untuk menambah yang baru.
                        </p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari berita..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Featured News Section */}
            {featuredBerita.length > 0 && (
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg border border-primary-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary-600 fill-current" />
                        Berita Unggulan Aktif
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredBerita.map((berita) => (
                            <NewsCard
                                key={berita.id}
                                berita={berita}
                                isFeatured={true}
                                onToggle={handleToggleFeatured}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All News List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Semua Berita Published</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat berita...</p>
                    </div>
                ) : filteredBerita.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Tidak ada berita ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBerita.map((berita) => (
                            <NewsCard
                                key={berita.id}
                                berita={berita}
                                isFeatured={berita.is_featured}
                                onToggle={handleToggleFeatured}
                                disabled={!berita.is_featured && featuredCount >= 5}
                            />
                        ))}
                    </div>
                )}
            </div>

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

/**
 * NewsCard Component
 */
const NewsCard = ({ berita, isFeatured, onToggle, disabled = false }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className={`relative rounded-lg border-2 overflow-hidden transition-all ${isFeatured ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
            }`}>
            {/* Featured Badge */}
            {isFeatured && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                    <Star className="w-3 h-3 fill-current" />
                    Unggulan
                </div>
            )}

            {/* Image */}
            <div className="relative h-40 bg-gray-100">
                {!imageError && berita.gambar_url ? (
                    <img
                        src={getImageUrl(berita.gambar_url)}
                        alt={berita.judul}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📰</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {berita.judul}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                    {formatRelativeTime(berita.created_at)}
                </p>

                {/* Toggle Button */}
                <button
                    onClick={() => onToggle(berita.id, isFeatured)}
                    disabled={disabled}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${isFeatured
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                    title={disabled ? 'Maksimal 5 berita unggulan' : ''}
                >
                    {isFeatured ? (
                        <>
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Hapus dari Unggulan
                        </>
                    ) : (
                        <>
                            <Star className="w-4 h-4 inline mr-2" />
                            Tandai sebagai Unggulan
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminFeaturedPage;
