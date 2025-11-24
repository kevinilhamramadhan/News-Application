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
            const bookmarkIds = data.map(b => b.berita_id);
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

        try {
            const { isBookmarked } = await bookmarkService.toggleBookmark(beritaId);

            if (isBookmarked) {
                setBookmarks(prev => [...prev, beritaId]);
            } else {
                setBookmarks(prev => prev.filter(id => id !== beritaId));
            }

            return isBookmarked;
        } catch (error) {
            console.error('Toggle bookmark error:', error);
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
