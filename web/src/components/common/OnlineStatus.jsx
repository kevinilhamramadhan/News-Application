import { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import useNetworkStatus from '../../hooks/useNetworkStatus';

/**
 * OnlineStatus Component
 * Displays online/offline status and syncing state
 * Banner pushes content down instead of overlaying
 */
const OnlineStatus = () => {
    const { isOnline, wasOffline } = useNetworkStatus();
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        let syncTimer;
        let autoHideTimer;

        if (!isOnline) {
            // Show offline message
            setMessage('Anda sedang offline');
            setSyncing(false);
            setShow(true);
        } else if (wasOffline && isOnline) {
            // Show reconnection message and sync
            setMessage('Koneksi kembali');
            setSyncing(true);
            setShow(true);

            // Simulate sync process
            syncTimer = setTimeout(() => {
                setSyncing(false);
                setMessage('Data tersinkronisasi');

                // Auto hide after showing sync success message
                autoHideTimer = setTimeout(() => {
                    setShow(false);
                }, 2000); // Hide 2 seconds after sync completes
            }, 1500);
        } else if (isOnline && !wasOffline) {
            // Already online and was never offline, don't show banner
            setShow(false);
        }

        return () => {
            clearTimeout(syncTimer);
            clearTimeout(autoHideTimer);
        };
    }, [isOnline, wasOffline]);

    if (!show) {
        return null;
    }

    return (
        <div className="sticky top-0 left-0 right-0 z-[100]">
            <div className={`transform transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className={`px-4 py-3 shadow-lg ${isOnline
                    ? syncing
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    : 'bg-red-500'
                    }`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-white">
                        {/* Icon */}
                        {isOnline ? (
                            syncing ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <Wifi className="w-5 h-5" />
                            )
                        ) : (
                            <WifiOff className="w-5 h-5" />
                        )}

                        {/* Message */}
                        <span className="font-medium text-sm">
                            {message}
                        </span>

                        {/* Additional info when offline */}
                        {!isOnline && (
                            <span className="text-xs text-white/90 hidden sm:inline">
                                • Beberapa fitur mungkin terbatas
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress bar for syncing */}
                {syncing && (
                    <div className="bg-yellow-400 h-1">
                        <div className="bg-white h-full animate-progress-bar" />
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .animate-progress-bar {
          animation: progress 1.5s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default OnlineStatus;
