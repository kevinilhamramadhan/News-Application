import { useState, useEffect } from 'react';
import { Newspaper, Eye, Clock, TrendingUp, Plus } from 'lucide-react';
import { adminService } from '../services/adminService';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminNav from '../components/admin/AdminNav';
import { getImageUrl } from '../utils/helpers';

/**
 * AdminDashboardPage Component
 * Admin dashboard with statistics and quick actions
 */
const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        totalBerita: 0,
        totalViews: 0,
        beritaToday: 0
    });
    const [recentBerita, setRecentBerita] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch all berita for stats
            const { data: allBerita } = await adminService.getAllBerita({ limit: 1000 });

            if (allBerita) {
                // Calculate stats
                const totalViews = allBerita.reduce((sum, item) => sum + (item.views || 0), 0);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const beritaToday = allBerita.filter(item => {
                    const createdDate = new Date(item.created_at);
                    createdDate.setHours(0, 0, 0, 0);
                    return createdDate.getTime() === today.getTime();
                }).length;

                setStats({
                    totalBerita: allBerita.length,
                    totalViews,
                    beritaToday
                });

                // Get recent berita (last 5)
                setRecentBerita(allBerita.slice(0, 5));
            }
        } catch (error) {
            console.error('Fetch dashboard data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <ProtectedRoute requireAdmin>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                <AdminNav currentPath="/admin/dashboard" />

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat data...</p>
                    </div>
                ) : (
                    <>
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Total Berita */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Total Berita</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalBerita}</p>
                                    </div>
                                    <div className="bg-primary-100 p-3 rounded-full">
                                        <Newspaper className="w-8 h-8 text-primary-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Total Views */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <Eye className="w-8 h-8 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Berita Hari Ini */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Berita Hari Ini</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.beritaToday}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <Clock className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Berita */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">Berita Terbaru</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentBerita.length === 0 ? (
                                    <div className="p-6 text-center text-gray-600">
                                        Belum ada berita
                                    </div>
                                ) : (
                                    recentBerita.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex gap-4">
                                                <img
                                                    src={getImageUrl(item.gambar_url)}
                                                    alt={item.judul}
                                                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                        {item.judul}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {item.kategori?.nama}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {item.views || 0} views
                                                        </span>
                                                        <span>{formatDate(item.created_at)}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.status === 'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {item.status === 'published' ? 'Published' : 'Draft'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`#/admin/berita/edit/${item.id}`}
                                                    className="flex-shrink-0 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors self-start"
                                                >
                                                    Edit
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default AdminDashboardPage;
