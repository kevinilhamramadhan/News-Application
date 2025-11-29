import { useEffect, useState } from 'react';

/**
 * PreCacheToast Component
 * Displays a small notification in the bottom-left corner
 * when pre-caching is complete
 */
const PreCacheToast = ({ isVisible, onClose }) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsShowing(true);

            // Auto-close after 8 seconds
            const timer = setTimeout(() => {
                setIsShowing(false);
                // Wait for fade-out animation, then call onClose to unmount
                setTimeout(() => {
                    onClose();
                }, 300);
            }, 8000);

            return () => clearTimeout(timer);
        } else {
            setIsShowing(false);
        }
    }, [isVisible, onClose]);

    if (!isVisible && !isShowing) return null;

    return (
        <div
            className={`fixed bottom-20 md:bottom-6 left-4 z-50 transition-all duration-300 transform ${isShowing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
        >
            <div
                className="bg-white rounded-lg shadow-2xl p-4 flex items-start gap-3 max-w-sm border-l-4 border-green-500"
                style={{
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                }}
            >
                {/* Success Icon */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-green-600"
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
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Konten Offline Siap! 🎉
                    </h4>
                    <p className="text-xs text-gray-600">
                        Anda sekarang bisa membaca berita secara offline
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => {
                        setIsShowing(false);
                        setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close notification"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Progress indicator (optional - shows it's auto-closing) */}
            <div className="mt-1 mx-4">
                <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-full transition-all duration-[8000ms] ease-linear"
                        style={{ width: isShowing ? '0%' : '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PreCacheToast;
