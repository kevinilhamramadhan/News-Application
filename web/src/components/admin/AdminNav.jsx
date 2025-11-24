import { LayoutDashboard, Plus, List } from 'lucide-react';

/**
 * AdminNav Component
 * Navigation for admin pages
 */
const AdminNav = ({ currentPath }) => {
    const adminNavItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/berita/create', icon: Plus, label: 'Buat Berita' },
        { path: '/admin/berita', icon: List, label: 'Kelola Berita' }
    ];

    const isActive = (path) => currentPath === path;

    return (
        <div className="bg-white border-b border-gray-200 mb-6">
            <div className="flex gap-1 overflow-x-auto">
                {adminNavItems.map((item) => (
                    <a
                        key={item.path}
                        href={`#${item.path}`}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${isActive(item.path)
                                ? 'border-primary-600 text-primary-600 font-semibold'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default AdminNav;
