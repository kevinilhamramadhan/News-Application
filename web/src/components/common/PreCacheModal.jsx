import { useEffect, useState } from 'react';

/**
 * PreCacheModal Component
 * Displays pre-caching progress with beautiful UI
 * Shows progress bar, status messages, and success notification
 */
const PreCacheModal = ({ isOpen, progress, isComplete, error, onClose, onRetry }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [autoCloseCountdown, setAutoCloseCountdown] = useState(5);

    // Handle modal visibility with animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Auto-close countdown when complete
    useEffect(() => {
        if (isComplete && isOpen) {
            setAutoCloseCountdown(5);
            const interval = setInterval(() => {
                setAutoCloseCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isComplete, isOpen, onClose]);

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={isComplete ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
            >
                <div
                    className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                        }`}
                    style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    }}
                >
                    {/* Error State */}
                    {error && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Oops! Terjadi Kesalahan
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {error.message || 'Gagal menyimpan konten untuk offline'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={onRetry}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        </>
                    )}

                    {/* Success State */}
                    {isComplete && !error && (
                        <>
                            <div className="text-center mb-6">
                                {/* Success Animation */}
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Selesai! 🎉
                                </h3>
                                <p className="text-gray-600 text-sm mb-1">
                                    Anda sekarang bisa membaca berita secara offline!
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Menutup otomatis dalam {autoCloseCountdown} detik
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                            >
                                Tutup
                            </button>
                        </>
                    )}

                    {/* Caching State */}
                    {!isComplete && !error && (
                        <>
                            <div className="text-center mb-6">
                                {/* Loading Icon */}
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-blue-600 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Menyiapkan Konten Offline
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Kami sedang menyimpan berita untuk Anda...
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {progress.status || 'Memulai...'}
                                    </span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {progress.percentage}%
                                    </span>
                                </div>

                                {/* Progress Bar Container */}
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progress.percentage}%` }}
                                    >
                                        <div className="h-full w-full bg-white/30 animate-pulse" />
                                    </div>
                                </div>

                                {/* Items Cached Counter */}
                                {progress.itemsCached > 0 && (
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        {progress.itemsCached} item tersimpan
                                    </p>
                                )}
                            </div>

                            {/* Info Message */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-blue-800 text-center">
                                    💡 Anda tetap bisa browsing saat proses ini berlangsung
                                </p>
                            </div>

                            {/* Optional: Skip/Cancel Button */}
                            {progress.percentage < 50 && (
                                <button
                                    onClick={onClose}
                                    className="mt-4 w-full px-4 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                                >
                                    Lewati
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default PreCacheModal;
