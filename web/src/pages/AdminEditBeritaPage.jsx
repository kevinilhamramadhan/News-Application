import { ArrowLeft } from 'lucide-react';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminNav from '../components/admin/AdminNav';
import BeritaForm from '../components/admin/BeritaForm';

/**
 * AdminEditBeritaPage Component
 * Admin page for editing existing berita
 */
const AdminEditBeritaPage = ({ id }) => {
    return (
        <ProtectedRoute requireAdmin>
            <div>
                {/* Breadcrumb */}
                <div className="mb-6">
                    <a
                        href="#/admin/berita"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali ke Kelola Berita
                    </a>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Berita</h1>
                </div>

                <AdminNav currentPath="/admin/berita" />

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <BeritaForm beritaId={id} />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminEditBeritaPage;
