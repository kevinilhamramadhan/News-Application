import { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * RegisterForm Component
 * Form for user registration
 */
const RegisterForm = ({ onSuccess, onSwitchToLogin, isModal = false }) => {
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setErrorMessage('');
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Nama lengkap harus diisi';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Nama lengkap minimal 3 karakter';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email harus diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.password) {
            newErrors.password = 'Password harus diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password harus diisi';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const { error } = await signUp(
                formData.email,
                formData.password,
                formData.fullName
            );

            if (error) {
                if (error.message.includes('already registered')) {
                    setErrorMessage('Email sudah terdaftar');
                } else {
                    setErrorMessage(error.message || 'Terjadi kesalahan saat registrasi');
                }
                return;
            }

            // Success
            setSuccessMessage('Registrasi berhasil! Silakan login.');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else if (!isModal) {
                    window.location.hash = '/login';
                }
            }, 2000);
        } catch (error) {
            setErrorMessage('Terjadi kesalahan saat registrasi');
            console.error('Register error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = (e) => {
        if (isModal && onSwitchToLogin) {
            e.preventDefault();
            onSwitchToLogin();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Success Alert */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Full Name Field */}
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.fullName
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                            }`}
                        placeholder="John Doe"
                    />
                </div>
                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.email
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                            }`}
                        placeholder="your@email.com"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.password
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                            }`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Minimal 6 karakter</p>
            </div>

            {/* Confirm Password Field */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.confirmPassword
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                            }`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Memproses...' : 'Daftar'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <a
                    href={isModal ? "#" : "#/login"}
                    onClick={handleLoginClick}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                    Masuk sekarang
                </a>
            </p>
        </form>
    );
};

export default RegisterForm;
