/**
 * Dual PWA Management Utilities
 * Handles manifest switching and service worker registration for both Customer and Admin apps
 */

export interface DualPWAConfig {
    isAdmin: boolean;
    manifestPath: string;
    swScope: string;
    appName: string;
}

/**
 * Get PWA configuration based on current route
 */
export const getPWAConfig = (pathname = window.location.pathname): DualPWAConfig => {
    const isAdmin = pathname.startsWith("/admin");
    return {
        isAdmin,
        manifestPath: isAdmin ? "/manifest-admin.json" : "/manifest-customer.json",
        swScope: isAdmin ? "/admin" : "/",
        appName: isAdmin ? "Admin" : "Customer",
    };
};

/**
 * Update the manifest link href based on current path
 */
export const switchManifest = (pathname = window.location.pathname) => {
    const config = getPWAConfig(pathname);
    const manifestLink = document.getElementById("manifest-link") as HTMLLinkElement;

    if (manifestLink && manifestLink.href !== config.manifestPath) {
        console.log(`[Dual PWA] Switching manifest from ${manifestLink.href} to ${config.manifestPath}`);
        manifestLink.href = config.manifestPath;

        // Trigger manifest change event for listening components
        window.dispatchEvent(
            new CustomEvent("manifestChanged", { detail: config })
        );
    }
};

/**
 * Unregister service workers with a specific scope
 * Cleans up old service workers when switching between apps
 */
export const unregisterSWByScope = async (scope: string) => {
    if (!("serviceWorker" in navigator)) return;

    try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const registration = registrations.find(reg => reg.scope.includes(scope));

        if (registration) {
            console.log(`[Dual PWA] Unregistering SW for scope: ${scope}`);
            await registration.unregister();
        }
    } catch (error) {
        console.error(`[Dual PWA] Failed to unregister SW for scope ${scope}:`, error);
    }
};

/**
 * Get all active service worker registrations
 */
export const getActiveRegistrations = async () => {
    if (!("serviceWorker" in navigator)) return [];

    try {
        return await navigator.serviceWorker.getRegistrations();
    } catch (error) {
        console.error("[Dual PWA] Failed to get registrations:", error);
        return [];
    }
};

/**
 * Check if app is installable (PWA requirements met)
 */
export const isInstallable = (): boolean => {
    return (
        "serviceWorker" in navigator &&
        "WebAssembly" in window &&
        matchMedia("(display-mode: browser)").matches
    );
};

/**
 * Get offline status
 */
export const isOffline = (): boolean => !navigator.onLine;

/**
 * Listen for offline/online events
 */
export const onOnlineStatusChange = (callback: (isOnline: boolean) => void) => {
    window.addEventListener("online", () => callback(true));
    window.addEventListener("offline", () => callback(false));

    // Return unsubscribe function
    return () => {
        window.removeEventListener("online", () => callback(true));
        window.removeEventListener("offline", () => callback(false));
    };
};

/**
 * Clear specific cache by name
 */
export const clearCache = async (cacheName: string) => {
    try {
        await caches.delete(cacheName);
        console.log(`[Dual PWA] Cleared cache: ${cacheName}`);
    } catch (error) {
        console.error(`[Dual PWA] Failed to clear cache ${cacheName}:`, error);
    }
};

/**
 * Clear all caches (use with caution)
 */
export const clearAllCaches = async () => {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log("[Dual PWA] Cleared all caches");
    } catch (error) {
        console.error("[Dual PWA] Failed to clear caches:", error);
    }
};

/**
 * Clear specific scope caches (e.g., all customer or all admin caches)
 */
export const clearScopeCaches = async (scope: "admin" | "customer") => {
    try {
        const cacheNames = await caches.keys();
        const scopePrefix = scope === "admin" ? "admin-" : "customer-";

        await Promise.all(
            cacheNames
                .filter(name => name.startsWith(scopePrefix))
                .map(name => caches.delete(name))
        );
        console.log(`[Dual PWA] Cleared ${scope} scope caches`);
    } catch (error) {
        console.error(`[Dual PWA] Failed to clear ${scope} caches:`, error);
    }
};
