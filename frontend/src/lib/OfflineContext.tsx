import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getFromIndexedDB, saveToIndexedDB } from './indexedDB';

interface OfflineContextProps {
    isOffline: boolean;
    lastSyncedAt: number | null;
    updateLastSync: (timestamp: number) => void;
}

const OfflineContext = createContext<OfflineContextProps>({
    isOffline: false,
    lastSyncedAt: null,
    updateLastSync: () => { }
});

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const appState = await getFromIndexedDB('app-state', 'global-sync');
                if (appState?.lastSyncedAt) {
                    setLastSyncedAt(appState.lastSyncedAt);
                }
            } catch (error) {
                console.error("Failed loading app state from IDB", error);
            } finally {
                setIsReady(true);
            }
        };
        init();
    }, []);

    const updateLastSync = useCallback(async (timestamp: number) => {
        setLastSyncedAt(timestamp);
        await saveToIndexedDB('app-state', 'global-sync', { lastSyncedAt: timestamp });
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            toast.success("Back online. Data synced.");
        };
        const handleOffline = () => {
            setIsOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const formatSyncTime = (timestamp: number | null) => {
        if (!timestamp) return "Never";
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isReady) return null; // Prevents UI rendering before cache sync hydration

    return (
        <OfflineContext.Provider value={{ isOffline, lastSyncedAt, updateLastSync }}>
            {/* Top Banner when Offline */}
            {isOffline && (
                <div className="fixed top-0 left-0 right-0 z-[60] bg-zinc-900 border-b border-red-500/50 text-white flex flex-col items-center justify-center py-2 shadow-md shadow-red-500/10 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                        </span>
                        Offline Mode – Showing last synced data
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-medium">
                        Last synced: {formatSyncTime(lastSyncedAt)}
                    </div>
                </div>
            )}

            {children}
        </OfflineContext.Provider>
    );
};

export const useOffline = () => useContext(OfflineContext);
