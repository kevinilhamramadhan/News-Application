import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import useInstallPrompt from '../../hooks/useInstallPrompt';
import { getDeviceType, getInstallInstructions, isIOS } from '../../utils/pwaUtils';

/**
 * InstallPWA Component
 * Shows a custom install prompt for the Progressive Web App
 */
const InstallPWA = () => {
    const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
    const [showPrompt, setShowPrompt] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        // Check if user has dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const dismissedTime = parseInt(dismissed, 10);
        const now = Date.now();

        // Show prompt if:
        // - App is installable
        // - Not already installed
        // - Not dismissed, or dismissed more than 7 days ago
        if (isInstallable && !isInstalled) {
            if (!dismissed || (now - dismissedTime > 7 * 24 * 60 * 60 * 1000)) {
                // Delay showing prompt for better UX
                const timer = setTimeout(() => {
                    setShowPrompt(true);
                }, 3000);

                return () => clearTimeout(timer);
            }
        }
    }, [isInstallable, isInstalled]);

    const handleInstall = async () => {
        setIsInstalling(true);

        const result = await promptInstall();

        setIsInstalling(false);

        if (result.success) {
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    const handleShowInstructions = () => {
        setShowInstructions(true);
    };

    // Don't show anything if already installed or not installable
    if (isInstalled || !showPrompt) {
        return null;
    }

    const deviceType = getDeviceType();
    const instructions = getInstallInstructions();

    return (
        <>
            {/* Install Banner */}
            <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-2xl p-6 text-white">
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                                <img
                                    src="/icons/icon-96x96.png"
                                    alt="BeritaKu"
                                    className="w-12 h-12"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <h3 className="font-bold text-lg mb-1">
                                Install BeritaKu
                            </h3>
                            <p className="text-white/90 text-sm mb-4">
                                Akses lebih cepat dan baca berita offline!
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {!isIOS() ? (
                                    <button
                                        onClick={handleInstall}
                                        disabled={isInstalling}
                                        className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download className="w-4 h-4" />
                                        {isInstalling ? 'Installing...' : 'Install'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleShowInstructions}
                                        className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
                                    >
                                        <Smartphone className="w-4 h-4" />
                                        Cara Install
                                    </button>
                                )}

                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Nanti
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* iOS Install Instructions Modal */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {instructions.title}
                            </h3>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {instructions.steps.map((step, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-700 pt-1 flex-1">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
        </>
    );
};

export default InstallPWA;
