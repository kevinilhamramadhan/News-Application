import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AuthModalProvider } from './contexts/AuthModalContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import BottomNav from './components/common/BottomNav';
import InstallPWA from './components/common/InstallPWA';
import OnlineStatus from './components/common/OnlineStatus';
import PreCacheToast from './components/common/PreCacheToast';
import { usePreCache } from './hooks/usePreCache';
import OfflinePage from './components/common/OfflinePage';
import HomePage from './pages/HomePage';
import BeritaPage from './pages/BeritaPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import KategoriPage from './pages/KategoriPage';
import KategoriDetailPage from './pages/KategoriDetailPage';
import BookmarkPage from './pages/BookmarkPage';
import ProfilPage from './pages/ProfilPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBeritaPage from './pages/AdminBeritaPage';
import AdminCreateBeritaPage from './pages/AdminCreateBeritaPage';
import AdminEditBeritaPage from './pages/AdminEditBeritaPage';
import AdminFeaturedPage from './pages/AdminFeaturedPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Pre-cache hook for offline functionality
  const {
    isFirstVisit,
    isPreCaching,
    progress,
    isComplete,
    error,
    startCaching,
    retryCaching,
    dismissModal,
  } = usePreCache();

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

  // Service Worker registration and update handling
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });

      // Check for updates periodically
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.update();
          }
        } catch (error) {
          console.error('Error checking for updates:', error);
        }
      };

      // Check for updates every 60 minutes
      const updateInterval = setInterval(checkForUpdates, 60 * 60 * 1000);

      return () => clearInterval(updateInterval);
    }
  }, []);

  // Auto-trigger pre-caching on first visit
  useEffect(() => {
    if (isFirstVisit && !isPreCaching) {
      // Small delay to ensure app is fully loaded
      const timer = setTimeout(() => {
        startCaching();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, isPreCaching, startCaching]);

  const handleUpdate = () => {
    window.location.reload();
  };

  const renderPage = () => {
    // Parse path and params
    const pathParts = currentPath.split('/').filter(Boolean);

    // Home
    if (currentPath === '/' || pathParts.length === 0) {
      return <HomePage />;
    }

    if (currentPath === '/profil') {
      return <ProfilPage />;
    }

    // Admin routes
    if (currentPath === '/admin/dashboard') {
      return <AdminDashboardPage />;
    }

    if (currentPath === '/admin/berita/create') {
      return <AdminCreateBeritaPage />;
    }

    if (pathParts[0] === 'admin' && pathParts[1] === 'berita' && pathParts[2] === 'edit' && pathParts[3]) {
      return <AdminEditBeritaPage id={pathParts[3]} />;
    }

    if (currentPath === '/admin/berita') {
      return <AdminBeritaPage />;
    }

    if (currentPath === '/admin/featured') {
      return <AdminFeaturedPage />;
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

    // Offline page
    if (currentPath === '/offline') {
      return <OfflinePage />;
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
    <AuthProvider>
      <AuthModalProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            {/* Sticky Header Container - stays at top on desktop */}
            <div className="sticky top-0 z-50">
              {/* PWA Status Banner */}
              <OnlineStatus />

              {/* Navigation - will be below banner when it appears */}
              <BottomNav currentPath={currentPath} />
            </div>

            {/* PWA Install Prompt */}
            <InstallPWA />

            {/* Pre-Cache Toast - Only shows after completion */}
            <PreCacheToast
              isVisible={isComplete && !error}
              onClose={dismissModal}
            />

            {/* Update Available Banner */}
            {updateAvailable && (
              <div className="sticky top-0 left-0 right-0 bg-blue-600 text-white py-3 px-4 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Update tersedia! Reload untuk mendapatkan versi terbaru.
                  </span>
                  <button
                    onClick={handleUpdate}
                    className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Reload
                  </button>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20 md:pb-8">
              {renderPage()}
            </main>
          </div>
        </ErrorBoundary>
      </AuthModalProvider>
    </AuthProvider>
  );
}

export default App;
