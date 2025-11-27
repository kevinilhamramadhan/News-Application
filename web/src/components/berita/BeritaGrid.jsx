import BeritaCard from './BeritaCard';
import Skeleton from '../common/Skeleton';
import { WifiOff, AlertCircle } from 'lucide-react';

const BeritaGrid = ({ berita, loading, error, onBookmarkToggle, bookmarkedIds = [], requireAuth = false, showBookmarkButton = true }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton variant="card" count={6} />
            </div>
        );
    }

    if (error) {
        // Check if error is an object with isOffline property
        const isOfflineError = typeof error === 'object' && error.isOffline;
        const errorMessage = typeof error === 'string' ? error : error.message;
        const errorDescription = typeof error === 'object' ? error.description : null;

        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isOfflineError
                                ? 'bg-gradient-to-br from-blue-100 to-cyan-100'
                                : 'bg-gradient-to-br from-red-100 to-orange-100'
                            }`}>
                            {isOfflineError ? (
                                <WifiOff className="w-10 h-10 text-blue-600" strokeWidth={2} />
                            ) : (
                                <AlertCircle className="w-10 h-10 text-red-600" strokeWidth={2} />
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {errorMessage}
                    </h3>

                    {errorDescription && (
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {errorDescription}
                        </p>
                    )}

                    {/* Tips for offline error */}
                    {isOfflineError && (
                        <div className="bg-white rounded-xl p-4 text-left">
                            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <span className="text-lg">💡</span>
                                Tips:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1.5">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Berita yang pernah dibuka bisa dibaca offline</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Sambungkan internet untuk melihat berita terbaru</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Retry button */}
                    <button
                        onClick={() => window.location.reload()}
                        className={`mt-6 px-6 py-3 rounded-lg font-semibold text-white transition-all ${isOfflineError
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                                : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600'
                            }`}
                    >
                        {isOfflineError ? 'Coba Lagi' : 'Muat Ulang'}
                    </button>
                </div>
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
                    showBookmarkButton={showBookmarkButton}
                />
            ))}
        </div>
    );
};

export default BeritaGrid;
