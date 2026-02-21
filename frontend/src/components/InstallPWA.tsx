import { usePWAInstall } from '../lib/usePWAInstall';
import { Download } from 'lucide-react';

export const InstallPWA = () => {
    const { canInstall, install } = usePWAInstall();

    if (!canInstall) return null;

    return (
        <button
            onClick={install}
            className="fixed bottom-20 right-4 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
        >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Install App</span>
        </button>
    );
};
