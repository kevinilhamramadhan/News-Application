import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { supabase } from '../../config/supabase';
import { getImageUrl } from '../../utils/helpers';
import { ITEMS_PER_PAGE } from '../../utils/constants';

/**
 * BeritaList Component
 * Admin list for managing all berita with CRUD operations
 */
const BeritaList = () => {
    const [berita, setBerita] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [search, setSearch] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchKategoris();
    }, []);

    useEffect(() => {
        fetchBerita();
    }, [currentPage, search, selectedKategori, selectedStatus]);

    const fetchKategoris = async () => {
        try {
            const { data } = await supabase
                .from('kategori')
                .select('*')
                .order('nama');
            setKategoris(data || []);
        } catch (error) {
            console.error('Fetch kategoris error:', error);
        }
    };

    const fetchBerita = async () => {
        setLoading(true);
        try {
            const params = {
                limit: ITEMS_PER_PAGE,
                offset: (currentPage - 1) * ITEMS_PER_PAGE,
                search: search || undefined,
                kategori_id: selectedKategori || undefined,
                status: selectedStatus
            };

            const { data, count } = await adminService.getAllBerita(params);

            setBerita(data || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Fetch berita error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleKategoriFilter = (e) => {
        setSelectedKategori(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleEdit = (id) => {
        window.location.hash = `/admin/berita/edit/${id}`;
    };

    const handleDeleteClick = (berita) => {
        setDeleteConfirm(berita);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;

        setDeleting(true);
        try {
            const { error } = await adminService.deleteBerita(deleteConfirm.id);

            if (error) throw error;

            // Refresh list
            fetchBerita();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Delete berita error:', error);
            alert('Gagal menghapus berita: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Cari berita..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Kategori Filter */}
                    <select
                        value={selectedKategori}
                        onChange={handleKategoriFilter}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Semua Kategori</option>
                        {kategoris.map((kategori) => (
                            <option key={kategori.id} value={kategori.id}>
                                {kategori.nama}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={handleStatusFilter}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">Semua Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
                Menampilkan {berita.length} dari {totalCount} berita
            </div>

            {/* Berita List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat berita...</p>
                </div>
            ) : berita.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                    <p className="text-gray-600">Tidak ada berita ditemukan</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Gambar</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Judul</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Views</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {berita.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <img
                                                src={getImageUrl(item.gambar)}
                                                alt={item.judul}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-xs">
                                                <p className="font-medium text-gray-900 line-clamp-2">{item.judul}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {item.users?.full_name || 'Unknown'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-900">
                                                {item.kategori?.nama}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Eye className="w-4 h-4" />
                                                {item.views || 0}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {berita.map((item) => (
                            <div key={item.id} className="p-4">
                                <div className="flex gap-3">
                                    <img
                                        src={getImageUrl(item.gambar)}
                                        alt={item.judul}
                                        className="w-20 h-20 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                                            {item.judul}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {item.kategori?.nama}
                                        </p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {item.views || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Sebelumnya
                    </button>

                    <span className="text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Selanjutnya
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Konfirmasi Hapus
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Apakah Anda yakin ingin menghapus berita "<strong>{deleteConfirm.judul}</strong>"?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeritaList;
