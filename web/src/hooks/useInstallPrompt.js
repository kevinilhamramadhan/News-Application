import { useState, useEffect } from 'react';
import { isPWAInstalled, logPWAEvent } from '../utils/pwaUtils';

/**
 * Custom hook to handle PWA install prompt
 * Manages the beforeinstallprompt event and installation state
 */
export const useInstallPrompt = () => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        setIsInstalled(isPWAInstalled());

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the default browser install prompt
            e.preventDefault();

            // Save the event for later use
            setInstallPrompt(e);
            setIsInstallable(true);

            logPWAEvent('install_prompt_available');
            console.log('PWA install prompt available');
        };

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setInstallPrompt(null);

            logPWAEvent('pwa_installed');
            console.log('PWA installed successfully');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    /**
     * Trigger the install prompt
     */
    const promptInstall = async () => {
        if (!installPrompt) {
            console.log('Install prompt not available');
            return { success: false, error: 'Install prompt not available' };
        }

        try {
            // Show the install prompt
            installPrompt.prompt();

            // Wait for the user's response
            const choiceResult = await installPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                logPWAEvent('install_accepted');
                console.log('User accepted the install prompt');

                // Clear the prompt
                setInstallPrompt(null);
                setIsInstallable(false);

                return { success: true, outcome: 'accepted' };
            } else {
                logPWAEvent('install_dismissed');
                console.log('User dismissed the install prompt');

                return { success: false, outcome: 'dismissed' };
            }
        } catch (error) {
            console.error('Error showing install prompt:', error);
            logPWAEvent('install_error', { error: error.message });

            return { success: false, error: error.message };
        }
    };

    return {
        isInstallable,
        isInstalled,
        promptInstall
    };
};

export default useInstallPrompt;
