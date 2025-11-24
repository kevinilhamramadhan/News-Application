import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading, isAdmin } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        window.location.hash = '/login';
        return null;
    }

    // Check if admin role is required
    if (requireAdmin && !isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md px-4">
                    <div className="bg-red-50 text-red-600 p-6 rounded-lg mb-6">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Akses Ditolak</h2>
                        <p className="text-red-700">
                            Anda tidak memiliki izin untuk mengakses halaman ini.
                            Halaman ini hanya untuk administrator.
                        </p>
                    </div>
                    <a
                        href="#/"
                        className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Kembali ke Beranda
                    </a>
                </div>
            </div>
        );
    }

    // Render protected content
    return children;
};

export default ProtectedRoute;
