import { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * LoginForm Component
 * Form for user authentication
 */
const LoginForm = ({ onSuccess, onSwitchToRegister, isModal = false }) => {
    const { signIn } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

        if (!formData.email.trim()) {
            newErrors.email = 'Email harus diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.password) {
            newErrors.password = 'Password harus diisi';
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

        try {
            const { error } = await signIn(formData.email, formData.password);

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setErrorMessage('Email atau password salah');
                } else {
                    setErrorMessage(error.message || 'Terjadi kesalahan saat login');
                }
                return;
            }

            // Success
            if (onSuccess) {
                onSuccess();
            } else if (!isModal) {
                window.location.hash = '/';
            }
        } catch (error) {
            setErrorMessage('Terjadi kesalahan saat login');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = (e) => {
        if (isModal && onSwitchToRegister) {
            e.preventDefault();
            onSwitchToRegister();
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
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Memproses...' : 'Masuk'}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
                Belum punya akun?{' '}
                <a
                    href={isModal ? "#" : "#/register"}
                    onClick={handleRegisterClick}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                    Daftar sekarang
                </a>
            </p>
        </form>
    );
};

export default LoginForm;
