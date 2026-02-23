import { useIsOffline, usePWAInstall, useIsPWA, usePWAConfig } from "../lib/usePWA";
import { Download, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Example PWA Status Component
 * 
 * Shows:
 * - Online/offline status
 * - Install prompt (if available)
 * - Running as PWA indicator
 * - Current app info
 * 
 * This is a reference implementation for how to use the dual PWA utilities
 */
export function PWAStatusExample() {
    const isOffline = useIsOffline();
    const isPWA = useIsPWA();
    const { isInstallable, promptInstall } = usePWAInstall();
    const config = usePWAConfig();

    return (
        <div className="space-y-3 p-4">
            {/* ============ OFFLINE STATUS ============ */}
            <AnimatePresence>
                {isOffline && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                    >
                        <WifiOff className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600 font-medium">
                            You're offline. Some features may be limited.
                        </span>
                    </motion.div>
                )}

                {!isOffline && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                        <Wifi className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                            Connected to network
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ============ INSTALL PROMPT ============ */}
            {isInstallable && !isPWA && (
                <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={promptInstall}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-brand-blue/20 border border-brand-blue/40 rounded-lg hover:bg-brand-blue/30 transition-colors"
                >
                    <Download className="w-4 h-4 text-brand-blue" />
                    <span className="text-sm text-brand-blue font-medium">
                        Install {config.appName} App
                    </span>
                </motion.button>
            )}

            {/* ============ PWA STATUS ============ */}
            {isPWA && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                >
                    <span className="text-xs font-semibold text-blue-600 px-2 py-1 bg-blue-500/20 rounded">
                        PWA MODE
                    </span>
                    <span className="text-sm text-blue-600 font-medium">
                        Running as installed app
                    </span>
                </motion.div>
            )}

            {/* ============ APP INFO ============ */}
            <div className="text-xs text-zinc-500 p-2 bg-zinc-900/30 rounded border border-zinc-700/30">
                <p>App: <span className="text-zinc-400 font-medium">{config.appName}</span></p>
                <p>Manifest: <span className="text-zinc-400 font-mono text-[10px]">{config.manifestPath}</span></p>
                <p>Scope: <span className="text-zinc-400 font-mono text-[10px]">{config.swScope}</span></p>
            </div>
        </div>
    );
}

/**
 * Example Offline-Aware Component
 * 
 * Shows different content when offline vs online
 */
export function OfflineAwareComponent() {
    const isOffline = useIsOffline();

    return (
        <div className="p-4 border border-zinc-700/50 rounded-lg">
            <AnimatePresence mode="wait">
                {isOffline ? (
                    <motion.div
                        key="offline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                    >
                        <h3 className="font-semibold text-zinc-300 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            Offline Mode
                        </h3>
                        <p className="text-sm text-zinc-400">
                            You're currently offline. Only cached content is available.
                        </p>
                        <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1 mt-2">
                            <li>View cached bookings</li>
                            <li>Browse services list</li>
                            <li>View your profile</li>
                        </ul>
                    </motion.div>
                ) : (
                    <motion.div
                        key="online"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                    >
                        <h3 className="font-semibold text-green-300 flex items-center gap-2">
                            <Wifi className="w-4 h-4 text-green-600" />
                            Online Mode
                        </h3>
                        <p className="text-sm text-zinc-400">
                            All features are available. Your data will be synced.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
