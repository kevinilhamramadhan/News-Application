import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminNav from '../components/admin/AdminNav';
import BeritaList from '../components/admin/BeritaList';

/**
 * AdminBeritaPage Component
 * Admin page for managing all berita
 */
const AdminBeritaPage = () => {
    return (
        <ProtectedRoute requireAdmin>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Kelola Berita</h1>

                <AdminNav currentPath="/admin/berita" />

                <BeritaList />
            </div>
        </ProtectedRoute>
    );
};

export default AdminBeritaPage;
