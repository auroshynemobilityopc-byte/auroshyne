import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface OfflineContextProps {
    isOffline: boolean;
}

const OfflineContext = createContext<OfflineContextProps>({ isOffline: false });

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            toast.success("Back online. Data synced.");
        };
        const handleOffline = () => {
            setIsOffline(true);
            toast("Offline Mode – Read Only", { icon: "⚠️" });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <OfflineContext.Provider value={{ isOffline }}>
            {/* Top Banner when Offline */}
            {isOffline && (
                <div className="fixed top-0 left-0 right-0 z-[60] bg-red-500 text-white text-center text-xs py-1.5 font-medium shadow-md shadow-red-500/20 animate-in slide-in-from-top-4 flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Offline Mode – Read Only
                </div>
            )}

            {children}
        </OfflineContext.Provider>
    );
};

export const useOffline = () => useContext(OfflineContext);
