import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { supabase } from '../../config/supabase';

/**
 * BeritaForm Component
 * Form for creating and editing berita (admin only)
 */
const BeritaForm = ({ beritaId = null, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        judul: '',
        kategori_id: '',
        konten: '',
        ringkasan: '',
        gambar: '',
        status: 'draft'
    });
    const [kategoris, setKategoris] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch kategoris
    useEffect(() => {
        fetchKategoris();
    }, []);

    // Fetch existing berita data if editing
    useEffect(() => {
        if (beritaId) {
            fetchBerita();
        }
    }, [beritaId]);

    const fetchKategoris = async () => {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .select('*')
                .order('nama');

            if (error) throw error;
            setKategoris(data || []);
        } catch (error) {
            console.error('Fetch kategoris error:', error);
        }
    };

    const fetchBerita = async () => {
        setLoadingData(true);
        try {
            const { data, error } = await adminService.getBeritaById(beritaId);
            if (error) throw error;

            setFormData({
                judul: data.judul || '',
                kategori_id: data.kategori_id || '',
                konten: data.konten || '',
                ringkasan: data.ringkasan || '',
                gambar: data.gambar || '',
                status: data.status || 'draft'
            });

            if (data.gambar) {
                setImagePreview(data.gambar);
            }
        } catch (error) {
            console.error('Fetch berita error:', error);
            setErrorMessage('Gagal memuat data berita');
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setErrorMessage('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, gambar: 'File harus berupa gambar' }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, gambar: 'Ukuran file maksimal 5MB' }));
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        if (errors.gambar) {
            setErrors(prev => ({ ...prev, gambar: '' }));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, gambar: '' }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.judul.trim()) {
            newErrors.judul = 'Judul harus diisi';
        } else if (formData.judul.trim().length < 10) {
            newErrors.judul = 'Judul minimal 10 karakter';
        }

        if (!formData.kategori_id) {
            newErrors.kategori_id = 'Kategori harus dipilih';
        }

        if (!formData.konten.trim()) {
            newErrors.konten = 'Konten harus diisi';
        } else if (formData.konten.trim().length < 50) {
            newErrors.konten = 'Konten minimal 50 karakter';
        }

        if (!formData.ringkasan.trim()) {
            newErrors.ringkasan = 'Ringkasan harus diisi';
        }

        if (!beritaId && !imageFile && !formData.gambar) {
            newErrors.gambar = 'Gambar harus diunggah';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e, status = 'draft') => {
        e.preventDefault();

        // Update status if publishing
        const submitData = { ...formData, status };

        if (!validate()) return;

        setLoading(true);
        setErrorMessage('');

        try {
            let imageUrl = submitData.gambar;

            // Upload image if new file selected
            if (imageFile) {
                const { url, error: uploadError } = await adminService.uploadImage(imageFile);

                if (uploadError) {
                    setErrorMessage('Gagal mengunggah gambar');
                    return;
                }

                imageUrl = url;
            }

            submitData.gambar = imageUrl;

            // Create or update berita
            if (beritaId) {
                const { error } = await adminService.updateBerita(beritaId, submitData);

                if (error) throw error;
            } else {
                const { error } = await adminService.createBerita(submitData);

                if (error) throw error;
            }

            // Success
            if (onSuccess) {
                onSuccess();
            } else {
                window.location.hash = '/admin/berita';
            }
        } catch (error) {
            console.error('Submit berita error:', error);
            setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan berita');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data...</p>
            </div>
        );
    }

    return (
        <form className="space-y-6">
            {/* Error Alert */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Judul */}
            <div>
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.judul
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                    placeholder="Masukkan judul berita"
                />
                {errors.judul && (
                    <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
                )}
            </div>

            {/* Kategori */}
            <div>
                <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                </label>
                <select
                    id="kategori_id"
                    name="kategori_id"
                    value={formData.kategori_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.kategori_id
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                >
                    <option value="">Pilih Kategori</option>
                    {kategoris.map((kategori) => (
                        <option key={kategori.id} value={kategori.id}>
                            {kategori.nama}
                        </option>
                    ))}
                </select>
                {errors.kategori_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.kategori_id}</p>
                )}
            </div>

            {/* Ringkasan */}
            <div>
                <label htmlFor="ringkasan" className="block text-sm font-medium text-gray-700 mb-2">
                    Ringkasan <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="ringkasan"
                    name="ringkasan"
                    value={formData.ringkasan}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.ringkasan
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                    placeholder="Ringkasan singkat berita"
                />
                {errors.ringkasan && (
                    <p className="mt-1 text-sm text-red-600">{errors.ringkasan}</p>
                )}
            </div>

            {/* Konten */}
            <div>
                <label htmlFor="konten" className="block text-sm font-medium text-gray-700 mb-2">
                    Konten Berita <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="konten"
                    name="konten"
                    value={formData.konten}
                    onChange={handleChange}
                    rows={12}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.konten
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                    placeholder="Tulis konten berita lengkap di sini..."
                />
                {errors.konten && (
                    <p className="mt-1 text-sm text-red-600">{errors.konten}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    {formData.konten.length} karakter (minimal 50)
                </p>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Berita <span className="text-red-500">*</span>
                </label>

                {imagePreview ? (
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                )}

                {errors.gambar && (
                    <p className="mt-1 text-sm text-red-600">{errors.gambar}</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    {loading ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                </button>

                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'published')}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    {loading ? 'Menyimpan...' : 'Publish Berita'}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Batal
                    </button>
                )}
            </div>
        </form>
    );
};

export default BeritaForm;
