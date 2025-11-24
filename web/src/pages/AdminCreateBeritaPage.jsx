import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminNav from '../components/admin/AdminNav';
import BeritaForm from '../components/admin/BeritaForm';

/**
 * AdminCreateBeritaPage Component
 * Admin page for creating new berita
 */
const AdminCreateBeritaPage = () => {
    return (
        <ProtectedRoute requireAdmin>
            <div>
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Buat Berita Baru</h1>
                </div>

                <AdminNav currentPath="/admin/berita/create" />

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <BeritaForm />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminCreateBeritaPage;
