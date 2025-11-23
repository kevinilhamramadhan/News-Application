import { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useBeritaPopular } from '../hooks/useBerita';
import { useBookmark } from '../hooks/useBookmark';
import BeritaGrid from '../components/berita/BeritaGrid';
import Skeleton from '../components/common/Skeleton';
import { getImageUrl } from '../utils/helpers';

const HomePage = () => {
    const { berita: popularBerita, loading: loadingPopular } = useBeritaPopular(6);
    const { bookmarks, toggleBookmark } = useBookmark();
    const [heroBerita, setHeroBerita] = useState(null);

    useEffect(() => {
        if (popularBerita && popularBerita.length > 0) {
            setHeroBerita(popularBerita[0]);
        }
    }, [popularBerita]);

    const handleBookmarkToggle = (beritaId) => {
        toggleBookmark(beritaId);
    };

    return (
        <div className="page-transition">
            {/* Hero Section */}
            <section className="mb-12">
                {loadingPopular || !heroBerita ? (
                    <Skeleton variant="hero" count={1} />
                ) : (
                    <div
                        className="relative h-96 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => (window.location.hash = `/berita/${heroBerita.id}`)}
                    >
                        <img
                            src={getImageUrl(heroBerita.gambar)}
                            alt={heroBerita.judul}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full mb-3">
                                Berita Unggulan
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-primary-300 transition-colors">
                                {heroBerita.judul}
                            </h1>
                            <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                                {heroBerita.konten?.substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <span>{heroBerita.kategori?.nama}</span>
                                <span>•</span>
                                <span>{heroBerita.views || 0} views</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Berita Terbaru */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Berita Terbaru</h2>
                    <a
                        href="#/berita"
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        <span>Lihat Semua</span>
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
                <BeritaGrid
                    berita={popularBerita.slice(1, 4)}
                    loading={loadingPopular}
                    onBookmarkToggle={handleBookmarkToggle}
                    bookmarkedIds={bookmarks}
                />
            </section>

            {/* Berita Populer */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Berita Populer</h2>
                </div>
                <BeritaGrid
                    berita={popularBerita.slice(4)}
                    loading={loadingPopular}
                    onBookmarkToggle={handleBookmarkToggle}
                    bookmarkedIds={bookmarks}
                />
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-3">Jelajahi Kategori Berita</h2>
                <p className="text-primary-100 mb-6">
                    Temukan berita sesuai minat Anda dari berbagai kategori yang tersedia
                </p>
                <a
                    href="#/kategori"
                    className="inline-block px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Lihat Kategori
                </a>
            </section>
        </div>
    );
};

export default HomePage;
