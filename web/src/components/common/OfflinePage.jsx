import { Cloud, RefreshCw, Bookmark, Home } from 'lucide-react';

/**
 * OfflinePage Component
 * Fallback page to show when user is offline
 */
const OfflinePage = () => {

    const handleRetry = () => {
        if (navigator.onLine) {
            window.location.reload(); // Refresh the page
        } else {
            alert('Masih offline. Silakan cek koneksi internet Anda.');
        }
    };

    const handleGoHome = () => {
        window.location.hash = '/';
    };

    const handleGoToBookmarks = () => {
        window.location.hash = '/bookmark';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                        <Cloud className="w-12 h-12 text-blue-600" strokeWidth={2} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Anda Sedang Offline
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    Sepertinya koneksi internet Anda terputus. Beberapa fitur mungkin tidak tersedia.
                </p>

                {/* Actions */}
                <div className="space-y-3 mb-8">
                    <button
                        onClick={handleRetry}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Coba Lagi
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Ke Beranda
                    </button>

                    <button
                        onClick={handleGoToBookmarks}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        <Bookmark className="w-5 h-5" />
                        Lihat Bookmark
                    </button>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 text-left">
                    <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        Yang Masih Bisa Anda Lakukan:
                    </h2>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Baca berita yang sudah pernah dibuka</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Lihat bookmark yang tersimpan</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Jelajahi halaman yang sudah di-cache</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Bookmark akan tersinkron otomatis saat online</span>
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="mt-6 text-xs text-gray-500">
                    BeritaKu • Progressive Web App
                </div>
            </div>
        </div>
    );
};

export default OfflinePage;
