import { useState, useEffect, useCallback } from "react";
import { api } from "./apiClient/axios";
import { getFromIndexedDB, saveToIndexedDB } from "./indexedDB";
import type { StoreName } from "./indexedDB";
import { useOffline } from "./OfflineContext";
import { toast } from "react-hot-toast";

export const useOfflineCachedQuery = <T,>(apiUrl: string, storeName: StoreName, fetchKey: string = "default") => {
    const { isOffline, updateLastSync } = useOffline();
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchData = useCallback(async () => {
        setIsFetching(true);
        try {
            if (isOffline) {
                const cachedData = await getFromIndexedDB(storeName, fetchKey);
                // @ts-ignore: We know that non app-state stores contain the data array.
                if (cachedData && 'data' in cachedData) {
                    // @ts-ignore
                    setData(cachedData.data as T);
                }
                setIsLoading(false);
                return;
            }

            // Online flow
            const res = await api.get(apiUrl);
            const fetchedData = res.data?.data || res.data;

            setData(fetchedData);
            await saveToIndexedDB(storeName, fetchKey, fetchedData);

            updateLastSync(Date.now());
        } catch (error) {
            console.error(`Fetch failed for ${apiUrl}`, error);
            const cachedData = await getFromIndexedDB(storeName, fetchKey);
            // @ts-ignore
            if (cachedData && 'data' in cachedData) {
                // @ts-ignore
                setData(cachedData.data as T);
            }
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [apiUrl, storeName, fetchKey, isOffline, updateLastSync]);

    useEffect(() => {
        fetchData();
        // Since isOffline changes true->false on reconnect, it will trigger fetchData again
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOffline, apiUrl, fetchKey]);

    const refetch = async () => {
        if (isOffline) {
            toast.error("This action requires internet");
            return;
        }
        await fetchData();
    };

    return { data, isLoading, isFetching, isOffline, refetch };
};

export const offlineActionGuard = (isOffline: boolean, action: () => void) => {
    if (isOffline) {
        toast.error("This action requires internet");
        return;
    }
    action();
};
