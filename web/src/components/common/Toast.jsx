import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <XCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 text-green-800 border-green-200';
            case 'error':
                return 'bg-red-50 text-red-800 border-red-200';
            case 'warning':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200';
            default:
                return 'bg-blue-50 text-blue-800 border-blue-200';
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getStyles()} animate-[slideIn_0.3s_ease-out]`}
            style={{
                animation: 'slideIn 0.3s ease-out',
            }}
        >
            {getIcon()}
            <span className="font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
