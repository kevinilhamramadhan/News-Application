import { Newspaper } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

/**
 * LoginPage Component
 * Authentication page for user login
 */
const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-600 p-3 rounded-full">
                            <Newspaper className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Portal Berita
                    </h1>
                    <p className="text-gray-600">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    <LoginForm />
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    © 2024 Portal Berita. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
