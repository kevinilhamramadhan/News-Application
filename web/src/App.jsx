import { useState, useEffect } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import BottomNav from './components/common/BottomNav';
import HomePage from './pages/HomePage';
import BeritaPage from './pages/BeritaPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import KategoriPage from './pages/KategoriPage';
import KategoriDetailPage from './pages/KategoriDetailPage';
import BookmarkPage from './pages/BookmarkPage';
import ProfilPage from './pages/ProfilPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.slice(1) || '/';
      setCurrentPath(path);

      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    // Parse path and params
    const pathParts = currentPath.split('/').filter(Boolean);

    // Home
    if (currentPath === '/' || pathParts.length === 0) {
      return <HomePage />;
    }

    // Berita list
    if (currentPath === '/berita') {
      return <BeritaPage />;
    }

    // Berita detail
    if (pathParts[0] === 'berita' && pathParts[1]) {
      return <BeritaDetailPage id={pathParts[1]} />;
    }

    // Kategori list
    if (currentPath === '/kategori') {
      return <KategoriPage />;
    }

    // Kategori detail
    if (pathParts[0] === 'kategori' && pathParts[1]) {
      return <KategoriDetailPage slug={pathParts[1]} />;
    }

    // Bookmark
    if (currentPath === '/bookmark') {
      return <BookmarkPage />;
    }

    // Profil
    if (currentPath === '/profil') {
      return <ProfilPage />;
    }

    // 404
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Halaman tidak ditemukan</p>
        <a
          href="#/"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <BottomNav currentPath={currentPath} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20 md:pb-8">
          {renderPage()}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
