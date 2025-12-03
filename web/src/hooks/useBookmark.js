import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { bookmarkService } from '../services/bookmarkService';

export const useBookmark = () => {
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch bookmarks when user logs in
    useEffect(() => {
        if (user) {
            fetchBookmarks();
        } else {
            setBookmarks([]);
        }
    }, [user]);

    const fetchBookmarks = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data } = await bookmarkService.getUserBookmarks();

            // API returns array of berita objects (already transformed in backend)
            // Each berita has an 'id' field
            const bookmarkIds = data.map(berita => berita.id);

            setBookmarks(bookmarkIds);
        } catch (error) {
            console.error('Fetch bookmarks error:', error);
            setBookmarks([]);
        } finally {
            setLoading(false);
        }
    };

    const addBookmark = useCallback(async (beritaId) => {
        if (!user) {
            throw new Error('AUTH_REQUIRED');
        }

        try {
            await bookmarkService.addBookmark(beritaId);
            setBookmarks(prev => [...prev, beritaId]);
            return true;
        } catch (error) {
            console.error('Add bookmark error:', error);
            throw error;
        }
    }, [user]);

    const removeBookmark = useCallback(async (beritaId) => {
        if (!user) {
            throw new Error('AUTH_REQUIRED');
        }

        try {
            await bookmarkService.removeBookmark(beritaId);
            setBookmarks(prev => prev.filter(id => id !== beritaId));
            return true;
        } catch (error) {
            console.error('Remove bookmark error:', error);
            throw error;
        }
    }, [user]);

    const toggleBookmark = useCallback(async (beritaId) => {
        if (!user) {
            throw new Error('AUTH_REQUIRED');
        }

        // Use a ref-like pattern: capture current state synchronously
        let isCurrentlyBookmarked = false;
        setBookmarks(prev => {
            isCurrentlyBookmarked = prev.includes(beritaId);
            return prev; // No change yet
        });

        try {
            if (isCurrentlyBookmarked) {
                // Remove bookmark
                await bookmarkService.removeBookmark(beritaId);
                setBookmarks(prev => prev.filter(id => id !== beritaId));
                return false;
            } else {
                // Add bookmark
                await bookmarkService.addBookmark(beritaId);
                setBookmarks(prev => {
                    // Double-check it's not already there to avoid duplicates
                    if (prev.includes(beritaId)) return prev;
                    return [...prev, beritaId];
                });
                return true;
            }
        } catch (error) {
            console.error('Toggle bookmark error:', error);
            // Refresh bookmarks from server on error to ensure sync
            fetchBookmarks().catch(err => console.error('Failed to refresh bookmarks:', err));
            throw error;
        }
    }, [user]);

    const isBookmarked = useCallback((beritaId) => {
        return bookmarks.includes(beritaId);
    }, [bookmarks]);

    return {
        bookmarks,
        loading,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        isBookmarked,
        isAuthenticated: !!user,
    };
};
