import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBerita } from '../hooks/useBerita';
import { useKategori } from '../hooks/useKategori';
import { useBookmark } from '../hooks/useBookmark';
import { useAuth } from '../hooks/useAuth';
import BeritaGrid from '../components/berita/BeritaGrid';
import BeritaFilter from '../components/berita/BeritaFilter';
import { ITEMS_PER_PAGE } from '../utils/constants';

const BeritaPage = () => {
    const [filters, setFilters] = useState({
        search: '',
        kategori: '',
        sort: 'newest',
        page: 1,
        limit: ITEMS_PER_PAGE,
    });

    const { berita, loading, error, pagination } = useBerita(filters);
    const { kategori } = useKategori();
    const { bookmarks, toggleBookmark, isAuthenticated } = useBookmark();
    const { isAdmin } = useAuth();

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: 1, // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBookmarkToggle = async (beritaId) => {
        try {
            await toggleBookmark(beritaId);
        } catch (error) {
            if (error.message === 'AUTH_REQUIRED') {
                // Error handled by BeritaCard
                return;
            }
            console.error('Bookmark toggle error:', error);
        }
    };

    return (
        <div className="page-transition">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Semua Berita</h1>
                <p className="text-gray-600">
                    Jelajahi berita terkini dari berbagai kategori
                </p>
            </div>

            {/* Filter */}
            <BeritaFilter
                onFilterChange={handleFilterChange}
                kategoriList={kategori}
            />

            {/* Grid */}
            <BeritaGrid
                berita={berita}
                loading={loading}
                error={error}
                onBookmarkToggle={handleBookmarkToggle}
                bookmarkedIds={bookmarks}
                requireAuth={!isAuthenticated}
                showBookmarkButton={!isAdmin}
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                                const current = pagination.currentPage;
                                return (
                                    page === 1 ||
                                    page === pagination.totalPages ||
                                    (page >= current - 1 && page <= current + 1)
                                );
                            })
                            .map((page, index, array) => (
                                <div key={page} className="flex items-center gap-2">
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <span className="text-gray-400">...</span>
                                    )}
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === pagination.currentPage
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                </div>
                            ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Results Info */}
            {pagination && (
                <div className="mt-4 text-center text-sm text-gray-600">
                    Menampilkan {((pagination.currentPage - 1) * pagination.limit) + 1} -{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.total)} dari{' '}
                    {pagination.total} berita
                </div>
            )}
        </div>
    );
};

export default BeritaPage;
