import { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookmark } from '../hooks/useBookmark';
import { useAuth } from '../hooks/useAuth';
import { beritaService } from '../services/beritaService';
import BeritaGrid from '../components/berita/BeritaGrid';
import Skeleton from '../components/common/Skeleton';
import { getImageUrl } from '../utils/helpers';

const HomePage = () => {
    const { bookmarks, toggleBookmark, isAuthenticated } = useBookmark();
    const { isAdmin } = useAuth();

    // Carousel state
    const [featuredNews, setFeaturedNews] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

    // Latest and Popular news states
    const [latestNews, setLatestNews] = useState([]);
    const [popularNews, setPopularNews] = useState([]);
    const [loadingLatest, setLoadingLatest] = useState(true);
    const [loadingPopular, setLoadingPopular] = useState(true);

    // Fetch featured news
    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await beritaService.getFeatured();
                if (data && data.length > 0) {
                    setFeaturedNews(data);
                } else {
                    // Fallback: fetch one popular news for hero
                    const response = await beritaService.getAll({ sort: 'popular', limit: 1 });
                    if (response.data && response.data.length > 0) {
                        setFeaturedNews([response.data[0]]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch featured news:', error);
            } finally {
                setLoadingFeatured(false);
            }
        };

        fetchFeatured();
    }, []);

    // Fetch latest news
    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const response = await beritaService.getAll({ sort: 'newest', limit: 6 });
                setLatestNews(response.data || []);
            } catch (error) {
                console.error('Failed to fetch latest news:', error);
            } finally {
                setLoadingLatest(false);
            }
        };

        fetchLatest();
    }, []);

    // Fetch popular news
    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const response = await beritaService.getAll({ sort: 'popular', limit: 6 });
                setPopularNews(response.data || []);
            } catch (error) {
                console.error('Failed to fetch popular news:', error);
            } finally {
                setLoadingPopular(false);
            }
        };

        fetchPopular();
    }, []);

    // Auto-rotation
    useEffect(() => {
        if (!isAutoPlaying || featuredNews.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % featuredNews.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, featuredNews.length]);

    const handlePrevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + featuredNews.length) % featuredNews.length);
        setIsAutoPlaying(false);
    };

    const handleNextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % featuredNews.length);
        setIsAutoPlaying(false);
    };

    const handleDotClick = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const handleBookmarkToggle = async (beritaId) => {
        try {
            await toggleBookmark(beritaId);
        } catch (error) {
            if (error.message === 'AUTH_REQUIRED') {
                return;
            }
            console.error('Bookmark toggle error:', error);
        }
    };

    const currentHeroBerita = featuredNews[currentSlide];

    return (
        <div className="page-transition">
            {/* Hero Section - Carousel */}
            <section className="mb-12">
                {(loadingFeatured || !currentHeroBerita) ? (
                    <Skeleton variant="hero" count={1} />
                ) : (
                    <div
                        className="relative h-96 rounded-xl overflow-hidden group"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        {/* Carousel Image */}
                        <div
                            className="cursor-pointer w-full h-full"
                            onClick={() => (window.location.hash = `/ berita / ${currentHeroBerita.id} `)}
                        >
                            <img
                                key={currentHeroBerita.id}
                                src={getImageUrl(currentHeroBerita.gambar_url)}
                                alt={currentHeroBerita.judul}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23f3f4f6" width="800" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E📰 Gambar Tidak Tersedia%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full mb-3">
                                Berita Unggulan
                            </span>
                            <h1
                                className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-primary-300 transition-colors cursor-pointer"
                                onClick={() => (window.location.hash = `/ berita / ${currentHeroBerita.id} `)}
                            >
                                {currentHeroBerita.judul}
                            </h1>
                            <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                                {currentHeroBerita.konten?.substring(0, 150) || currentHeroBerita.ringkasan?.substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <span>{currentHeroBerita.kategori?.nama}</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {currentHeroBerita.views || 0} views
                                </span>
                            </div>
                        </div>

                        {/* Prev/Next Buttons - Only show if multiple slides */}
                        {featuredNews.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevSlide();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNextSlide();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dot Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {featuredNews.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDotClick(index);
                                            }}
                                            className={`w - 2 h - 2 rounded - full transition - all ${index === currentSlide
                                                ? 'bg-white w-8'
                                                : 'bg-white/50 hover:bg-white/75'
                                                } `}
                                            aria-label={`Go to slide ${index + 1} `}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
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
                    berita={latestNews}
                    loading={loadingLatest}
                    onBookmarkToggle={handleBookmarkToggle}
                    bookmarkedIds={bookmarks}
                    requireAuth={!isAuthenticated}
                    showBookmarkButton={!isAdmin}
                />
            </section>

            {/* Berita Populer */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Berita Populer</h2>
                </div>
                <BeritaGrid
                    berita={popularNews}
                    loading={loadingPopular}
                    onBookmarkToggle={handleBookmarkToggle}
                    bookmarkedIds={bookmarks}
                    requireAuth={!isAuthenticated}
                    showBookmarkButton={!isAdmin}
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
