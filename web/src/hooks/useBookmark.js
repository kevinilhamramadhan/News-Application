import { useState, useEffect } from 'react';
import { bookmarkUtils } from '../utils/storage';

export const useBookmark = () => {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        setBookmarks(bookmarkUtils.getAll());
    }, []);

    const addBookmark = (beritaId) => {
        bookmarkUtils.add(beritaId);
        setBookmarks(bookmarkUtils.getAll());
    };

    const removeBookmark = (beritaId) => {
        bookmarkUtils.remove(beritaId);
        setBookmarks(bookmarkUtils.getAll());
    };

    const toggleBookmark = (beritaId) => {
        const isBookmarked = bookmarkUtils.toggle(beritaId);
        setBookmarks(bookmarkUtils.getAll());
        return isBookmarked;
    };

    const isBookmarked = (beritaId) => {
        return bookmarks.includes(beritaId);
    };

    return {
        bookmarks,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        isBookmarked,
    };
};
