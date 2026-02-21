import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Evaluate if already installed initially
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone || document.referrer.includes('android-app://');
        setIsInstalled(isStandalone);

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const appInstalledHandler = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", appInstalledHandler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("appinstalled", appInstalledHandler);
        };
    }, []);

    const install = async () => {
        if (!deferredPrompt) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            if (isIOS) {
                toast("To install: tap the Share icon below, then 'Add to Home Screen'.", { icon: '📱', duration: 5000 });
            } else {
                toast("To install: tap your browser menu (3 dots) and select 'Install app' or 'Add to Home screen'.", { icon: '📲', duration: 5000 });
            }
            return;
        }
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    return { canInstall: !!deferredPrompt, install, isInstalled };
};
