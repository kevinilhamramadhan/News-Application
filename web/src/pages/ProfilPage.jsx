import { useState } from 'react';
import { User, Mail, Shield, LogOut, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/common/ProtectedRoute';

/**
 * ProfilPage Component
 * User profile page with edit functionality
 */
const ProfilPage = () => {
    const { user, isAdmin, signOut, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.profile?.full_name || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({ type: '', text: '' });
    };

    const handleSave = async () => {
        if (!formData.full_name.trim()) {
            setMessage({ type: 'error', text: 'Nama lengkap harus diisi' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await updateProfile(formData);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Gagal memperbarui profil' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ full_name: user?.profile?.full_name || '' });
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const handleLogout = async () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            await signOut();
        }
    };

    return (
        <ProtectedRoute>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Saya</h1>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header with Avatar */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-4 rounded-full">
                                <User className="w-16 h-16" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">
                                    {user?.profile?.full_name || 'User'}
                                </h2>
                                <p className="text-primary-100">{user?.email}</p>
                                {isAdmin && (
                                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                                        <Shield className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Administrator</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="p-6 space-y-6">
                        {/* Message */}
                        {message.text && (
                            <div className={`p-4 rounded-lg ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                            />
                            <p className="mt-1 text-sm text-gray-500">Email tidak dapat diubah</p>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Nama Lengkap
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Masukkan nama lengkap"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={user?.profile?.full_name || '-'}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                                />
                            )}
                        </div>

                        {/* Role (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Shield className="w-4 h-4 inline mr-2" />
                                Role
                            </label>
                            <input
                                type="text"
                                value={user?.role === 'admin' ? 'Administrator' : 'User'}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                        Batal
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                        Edit Profil
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Keluar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Admin Link */}
                {isAdmin && (
                    <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
                        <p className="text-primary-900 mb-2">
                            <Shield className="w-5 h-5 inline mr-2" />
                            Anda memiliki akses administrator
                        </p>
                        <a
                            href="#/admin/dashboard"
                            className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Buka Admin Dashboard
                        </a>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default ProfilPage;
