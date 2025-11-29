import { useState, useEffect, useCallback } from 'react';
import { isFirstVisit, startPreCache, getCacheStatus } from '../services/preCacheService';

/**
 * Custom hook for managing pre-cache state and lifecycle
 * Handles first visit detection, caching progress, and completion
 */
export const usePreCache = () => {
    const [state, setState] = useState({
        isFirstVisit: false,
        isPreCaching: false,
        progress: {
            percentage: 0,
            status: '',
            itemsCached: 0,
        },
        error: null,
        isComplete: false,
    });

    // Check first visit on mount
    useEffect(() => {
        const checkFirstVisit = () => {
            const firstVisit = isFirstVisit();
            setState(prev => ({
                ...prev,
                isFirstVisit: firstVisit,
            }));
        };

        checkFirstVisit();
    }, []);

    /**
     * Progress callback for cache service
     */
    const handleProgress = useCallback((progress) => {
        setState(prev => ({
            ...prev,
            progress: {
                percentage: Math.round(progress.percentage),
                status: progress.status,
                itemsCached: progress.itemsCached || 0,
            },
        }));
    }, []);

    /**
     * Start the pre-caching process
     */
    const startCaching = useCallback(async () => {
        // Check network status
        if (!navigator.onLine) {
            setState(prev => ({
                ...prev,
                error: new Error('Tidak ada koneksi internet. Silakan coba lagi saat online.'),
            }));
            return;
        }

        setState(prev => ({
            ...prev,
            isPreCaching: true,
            error: null,
            isComplete: false,
            progress: {
                percentage: 0,
                status: 'Memulai proses caching...',
                itemsCached: 0,
            },
        }));

        try {
            const result = await startPreCache(handleProgress);

            if (result.alreadyCached) {
                // Already cached, just close
                setState(prev => ({
                    ...prev,
                    isPreCaching: false,
                    isFirstVisit: false,
                }));
                return;
            }

            // Success!
            setState(prev => ({
                ...prev,
                isComplete: true,
                isFirstVisit: false,
                error: null,
            }));

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    isPreCaching: false,
                    isComplete: false,
                }));
            }, 5000);

        } catch (error) {
            console.error('Pre-cache error:', error);
            setState(prev => ({
                ...prev,
                error,
                isPreCaching: false,
                isComplete: false,
            }));
        }
    }, [handleProgress]);

    /**
     * Retry caching after error
     */
    const retryCaching = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
        }));
        startCaching();
    }, [startCaching]);

    /**
     * Manually dismiss the modal
     */
    const dismissModal = useCallback(() => {
        setState(prev => ({
            ...prev,
            isPreCaching: false,
            isComplete: false,
            error: null,
        }));
    }, []);

    /**
     * Get cache status information
     */
    const cacheStatus = getCacheStatus();

    return {
        isFirstVisit: state.isFirstVisit,
        isPreCaching: state.isPreCaching,
        progress: state.progress,
        error: state.error,
        isComplete: state.isComplete,
        cacheStatus,
        startCaching,
        retryCaching,
        dismissModal,
    };
};

export default usePreCache;
