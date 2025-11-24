import React, { useState, createContext } from 'react';
import Modal from '../components/common/Modal';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

/**
 * AuthModalProvider Context
 * Provides modal state management for login/register modals
 */
export const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

    const openLoginModal = () => {
        setRegisterModalOpen(false);
        setLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setLoginModalOpen(false);
    };

    const openRegisterModal = () => {
        setLoginModalOpen(false);
        setRegisterModalOpen(true);
    };

    const closeRegisterModal = () => {
        setRegisterModalOpen(false);
    };

    const switchToRegister = () => {
        setLoginModalOpen(false);
        setRegisterModalOpen(true);
    };

    const switchToLogin = () => {
        setRegisterModalOpen(false);
        setLoginModalOpen(true);
    };

    return (
        <AuthModalContext.Provider value={{
            openLoginModal,
            closeLoginModal,
            openRegisterModal,
            closeRegisterModal,
            switchToRegister,
            switchToLogin,
        }}>
            {children}

            {/* Login Modal */}
            <Modal
                isOpen={loginModalOpen}
                onClose={closeLoginModal}
                title="Masuk ke Akun Anda"
                size="md"
            >
                <LoginForm
                    onSuccess={closeLoginModal}
                    onSwitchToRegister={switchToRegister}
                    isModal={true}
                />
            </Modal>

            {/* Register Modal */}
            <Modal
                isOpen={registerModalOpen}
                onClose={closeRegisterModal}
                title="Buat Akun Baru"
                size="md"
            >
                <RegisterForm
                    onSuccess={() => {
                        closeRegisterModal();
                        openLoginModal();
                    }}
                    onSwitchToLogin={switchToLogin}
                    isModal={true}
                />
            </Modal>
        </AuthModalContext.Provider>
    );
};
