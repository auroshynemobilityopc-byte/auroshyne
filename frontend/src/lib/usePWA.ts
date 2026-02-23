import { useEffect, useState, useCallback } from "react";
import {
    getPWAConfig,
    onOnlineStatusChange,
    type DualPWAConfig
} from "./dualPWA";

/**
 * Hook to get current PWA configuration
 */
export const usePWAConfig = () => {
    const [config, setConfig] = useState<DualPWAConfig>(() =>
        getPWAConfig()
    );

    useEffect(() => {
        const handleManifestChange = (event: CustomEvent<DualPWAConfig>) => {
            setConfig(event.detail);
        };

        const handlePopState = () => {
            setConfig(getPWAConfig());
        };

        window.addEventListener("manifestChanged", handleManifestChange as EventListener);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("manifestChanged", handleManifestChange as EventListener);
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return config;
};

/**
 * Hook to track online/offline status
 */
export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(() => navigator.onLine);

    useEffect(() => {
        return onOnlineStatusChange((online) => setIsOnline(online));
    }, []);

    return isOnline;
};

/**
 * Hook to track if offline (convenience wrapper)
 */
export const useIsOffline = () => {
    return !useOnlineStatus();
};

/**
 * Hook for PWA installation prompt
 */
export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setIsInstallable(false);
            console.log("[PWA] App installed successfully");
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) return false;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        setDeferredPrompt(null);
        setIsInstallable(false);

        return outcome === "accepted";
    }, [deferredPrompt]);

    return { isInstallable, promptInstall };
};

/**
 * Hook to detect if app is running in PWA mode
 */
export const useIsPWA = () => {
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        // Check if app is running as installed PWA
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches
            || (window.navigator as any).standalone === true;

        const isFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
        const isMinimalUI = window.matchMedia("(display-mode: minimal-ui)").matches;

        setIsPWA(isStandalone || isFullscreen || isMinimalUI);
    }, []);

    return isPWA;
};

/**
 * Hook to call a function when switching between apps
 * Useful for cleanup or reinitialization
 */
export const useOnAppSwitch = (callback: (config: DualPWAConfig) => void) => {
    const config = usePWAConfig();

    useEffect(() => {
        callback(config);
    }, [config.appName, callback]);
};
