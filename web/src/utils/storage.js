const BOOKMARK_KEY = 'bookmarked_berita';

export const bookmarkUtils = {
    getAll: () => {
        try {
            return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
        } catch {
            return [];
        }
    },

    add: (beritaId) => {
        const bookmarks = bookmarkUtils.getAll();
        if (!bookmarks.includes(beritaId)) {
            bookmarks.push(beritaId);
            localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
        }
    },

    remove: (beritaId) => {
        const bookmarks = bookmarkUtils.getAll();
        const filtered = bookmarks.filter(id => id !== beritaId);
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(filtered));
    },

    isBookmarked: (beritaId) => {
        return bookmarkUtils.getAll().includes(beritaId);
    },

    toggle: (beritaId) => {
        if (bookmarkUtils.isBookmarked(beritaId)) {
            bookmarkUtils.remove(beritaId);
            return false;
        } else {
            bookmarkUtils.add(beritaId);
            return true;
        }
    }
};
