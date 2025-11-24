import { Home, Newspaper, Folder, Bookmark, User, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthModal } from '../../hooks/useAuthModal';

/**
 * BottomNav Component
 * Responsive navigation bar with auth-aware menu items
 */
const BottomNav = ({ currentPath }) => {
    const { user, isAdmin } = useAuth();
    const { openLoginModal } = useAuthModal();

    // Navigation items for all users
    const allNavItems = [
        { path: '/', icon: Home, label: 'Beranda' },
        { path: '/berita', icon: Newspaper, label: 'Berita' },
        { path: '/kategori', icon: Folder, label: 'Kategori' },
        { path: '/bookmark', icon: Bookmark, label: 'Bookmark' }
    ];

    // Filter out bookmark for admin users
    const publicNavItems = isAdmin
        ? allNavItems.filter(item => item.path !== '/bookmark')
        : allNavItems;

    // Check if path is active
    const isActive = (path) => {
        if (path === '/') {
            return currentPath === '/';
        }
        return currentPath.startsWith(path);
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        openLoginModal();
    };

    return (
        <>
            {/* Desktop Top Navigation */}
            <nav className="hidden md:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="#/" className="flex items-center gap-2">
                            <Newspaper className="w-8 h-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900">Portal Berita</span>
                        </a>

                        {/* Desktop Menu */}
                        <div className="flex items-center gap-1">
                            {publicNavItems.map((item) => (
                                <a
                                    key={item.path}
                                    href={`#${item.path}`}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-primary-50 text-primary-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </a>
                            ))}

                            {/* Admin Dashboard (if admin) */}
                            {isAdmin && (
                                <a
                                    href="#/admin/dashboard"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPath.startsWith('/admin')
                                        ? 'bg-primary-50 text-primary-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>Admin</span>
                                </a>
                            )}
                        </div>

                        {/* Auth Actions */}
                        <div className="flex items-center gap-2">
                            {user ? (
                                <a
                                    href="#/profil"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPath === '/profil'
                                        ? 'bg-primary-50 text-primary-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span>{user.profile?.full_name || user.email}</span>
                                    {isAdmin && (
                                        <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-primary-600 text-white rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </a>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Masuk</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="grid grid-cols-5 h-16">
                    {publicNavItems.map((item) => (
                        <a
                            key={item.path}
                            href={`#${item.path}`}
                            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive(item.path)
                                ? 'text-primary-600'
                                : 'text-gray-600'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </a>
                    ))}

                    {/* Profile or Login */}
                    {user ? (
                        <a
                            href="#/profil"
                            className={`flex flex-col items-center justify-center gap-1 transition-colors ${currentPath === '/profil'
                                ? 'text-primary-600'
                                : 'text-gray-600'
                                }`}
                        >
                            <User className="w-6 h-6" />
                            <span className="text-xs font-medium">Profil</span>
                            {isAdmin && (
                                <span className="absolute top-1 right-2 w-2 h-2 bg-primary-600 rounded-full"></span>
                            )}
                        </a>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className={`flex flex-col items-center justify-center gap-1 transition-colors text-gray-600`}
                        >
                            <LogIn className="w-6 h-6" />
                            <span className="text-xs font-medium">Masuk</span>
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
