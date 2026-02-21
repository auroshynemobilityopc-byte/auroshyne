import { useState, useEffect, useCallback } from "react";
import { api } from "./apiClient/axios";
import { idbGet, idbSet } from "./indexedDB";
import { useOffline } from "./OfflineContext";
import { toast } from "react-hot-toast";

export const useOfflineCachedQuery = <T,>(apiUrl: string, cacheKey: string) => {
    const { isOffline, updateLastSync } = useOffline();
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStale, setIsStale] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Try Cache First approach (Stale-while-revalidate pattern)
            const cachedData = await idbGet(cacheKey);
            if (cachedData) {
                setData(cachedData);
                setIsStale(true);
            }

            // 2. Refresh from Network if online
            if (!isOffline) {
                const res = await api.get(apiUrl);
                const fetchedData = res.data?.data || res.data;
                setData(fetchedData);
                setIsStale(false);

                // Update specific DB store
                await idbSet(cacheKey, fetchedData);

                // Update Global Context Sync Time using current time
                updateLastSync(Date.now());
            }
        } catch (error) {
            console.error(`Fetch failed for ${apiUrl}`, error);
            // Fallback natively to cachedData when we remain offline without error messages
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, cacheKey, isOffline, updateLastSync]);

    useEffect(() => {
        fetchData();
        // Since isOffline changes true->false on reconnect, it will trigger fetchData again completely automatically syncing all used hooks instances gracefully
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOffline]);

    const revalidate = async () => {
        if (isOffline) {
            toast.error("This action requires internet");
            return;
        }
        await fetchData();
    };

    return { data, isLoading, isStale, isOffline, revalidate };
};

export const offlineActionGuard = (isOffline: boolean, action: () => void) => {
    if (isOffline) {
        toast.error("This action requires internet");
        return;
    }
    action();
};
