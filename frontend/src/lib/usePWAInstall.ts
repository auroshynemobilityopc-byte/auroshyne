import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () =>
            window.removeEventListener("beforeinstallprompt", handler);
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

    return { canInstall: !!deferredPrompt, install };
};
