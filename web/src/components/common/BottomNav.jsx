import { Home, Newspaper, Grid, Bookmark, User } from 'lucide-react';

const BottomNav = ({ currentPath }) => {
    const navItems = [
        { path: '/', icon: Home, label: 'Beranda' },
        { path: '/berita', icon: Newspaper, label: 'Berita' },
        { path: '/kategori', icon: Grid, label: 'Kategori' },
        { path: '/bookmark', icon: Bookmark, label: 'Bookmark' },
        { path: '/profil', icon: User, label: 'Profil' },
    ];

    const isActive = (path) => {
        if (path === '/') {
            return currentPath === '/';
        }
        return currentPath.startsWith(path);
    };

    return (
        <>
            {/* Desktop Navigation - Sticky Top */}
            <nav className="hidden md:block sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Newspaper className="w-8 h-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">Portal Berita</span>
                        </div>
                        <div className="flex space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <a
                                        key={item.path}
                                        href={`#${item.path}`}
                                        className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${active
                                                ? 'bg-primary-50 text-primary-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-2" />
                                        <span>{item.label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation - Bottom */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
                <div className="grid grid-cols-5 h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <a
                                key={item.path}
                                href={`#${item.path}`}
                                className={`flex flex-col items-center justify-center transition-all duration-200 ${active ? 'text-primary-600' : 'text-gray-600'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''}`} />
                                <span className={`text-xs mt-1 ${active ? 'font-medium' : ''}`}>
                                    {item.label}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
