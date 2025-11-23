import { useState, useEffect } from 'react';
import { BookmarkX } from 'lucide-react';
import { useBookmark } from '../hooks/useBookmark';
import { beritaService } from '../services/beritaService';
import BeritaGrid from '../components/berita/BeritaGrid';

const BookmarkPage = () => {
    const { bookmarks, toggleBookmark } = useBookmark();
    const [beritaList, setBeritaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarkedBerita = async () => {
            if (bookmarks.length === 0) {
                setBeritaList([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch each bookmarked berita
                const promises = bookmarks.map((id) =>
                    beritaService.getById(id).catch(() => null)
                );
                const results = await Promise.all(promises);

                // Filter out null results (failed fetches)
                const validBerita = results
                    .filter((res) => res !== null)
                    .map((res) => res.data.data || res.data);

                setBeritaList(validBerita);
            } catch (err) {
                setError('Gagal memuat berita bookmark');
                setBeritaList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarkedBerita();
    }, [bookmarks]);

    const handleBookmarkToggle = (beritaId) => {
        toggleBookmark(beritaId);
    };

    if (!loading && bookmarks.length === 0) {
        return (
            <div className="page-transition">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookmark</h1>
                <div className="text-center py-16">
                    <BookmarkX className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Belum Ada Bookmark
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Anda belum menyimpan berita apapun. Mulai simpan berita favorit Anda!
                    </p>
                    <a
                        href="#/berita"
                        className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Jelajahi Berita
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="page-transition">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmark</h1>
                <p className="text-gray-600">
                    {bookmarks.length} berita tersimpan
                </p>
            </div>

            <BeritaGrid
                berita={beritaList}
                loading={loading}
                error={error}
                onBookmarkToggle={handleBookmarkToggle}
                bookmarkedIds={bookmarks}
            />
        </div>
    );
};

export default BookmarkPage;
