import { useState, useEffect } from 'react';

/**
 * Custom hook to track network status
 * Returns online/offline state and connection information
 */
export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [wasOffline, setWasOffline] = useState(false);
    const [connectionType, setConnectionType] = useState('unknown');

    useEffect(() => {
        // Update online status
        const handleOnline = () => {
            setIsOnline(true);
            if (wasOffline) {
                console.log('Connection restored');
                // Reset wasOffline after showing reconnection message
                setTimeout(() => {
                    setWasOffline(false);
                }, 4000); // Reset after banner auto-hide completes (1.5s sync + 2s display + buffer)
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
            console.log('Connection lost');
        };

        // Get connection type if available
        const updateConnectionType = () => {
            if ('connection' in navigator) {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (conn) {
                    setConnectionType(conn.effectiveType || conn.type || 'unknown');
                }
            }
        };

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Listen for connection changes
        if ('connection' in navigator) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                conn.addEventListener('change', updateConnectionType);
            }
        }

        // Initial connection type
        updateConnectionType();

        // Cleanup
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);

            if ('connection' in navigator) {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (conn) {
                    conn.removeEventListener('change', updateConnectionType);
                }
            }
        };
    }, [wasOffline]);

    return {
        isOnline,
        wasOffline,
        connectionType,
        isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g'
    };
};

export default useNetworkStatus;
