import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyProfile, logoutCustomer, updateMyProfile,
    getSavedData, addAddress, deleteAddress, addVehicle, deleteVehicle
} from "./api";
import { clearCustomerToken } from "../../../app/customer/customerStorage";
import { saveCustomerData, getCustomerData, clearAllCustomerData } from "../../../lib/customerIndexedDB";
import toast from "react-hot-toast";

// ─── Offline-aware fetch helper ───────────────────────────────────────────────

const fetchWithOfflineFallback = async <T>(
    fetchFn: () => Promise<T>,
    store: 'customer-profile' | 'customer-saved',
    cacheKey: string
): Promise<T> => {
    if (!navigator.onLine) {
        const cached = await getCustomerData(store, cacheKey);
        if (cached) return cached.data as T;
        throw new Error("You are offline and no cached data is available.");
    }
    try {
        const result = await fetchFn();
        await saveCustomerData(store, cacheKey, result);
        return result;
    } catch (err: any) {
        // Treat network-level errors as offline fallback
        if (!err?.response) {
            const cached = await getCustomerData(store, cacheKey);
            if (cached) return cached.data as T;
        }
        throw err;
    }
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useMyProfile = () => {
    return useQuery({
        queryKey: ["customerProfile"],
        queryFn: () =>
            fetchWithOfflineFallback(getMyProfile, "customer-profile", "my-profile"),
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: false,
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: logoutCustomer,
        onSuccess: async () => {
            clearCustomerToken();
            // Wipe offline cache on explicit logout
            await clearAllCustomerData();
            toast.success("Logged out successfully");
            window.location.href = "/login";
        },
        onError: async () => {
            clearCustomerToken();
            await clearAllCustomerData();
            window.location.href = "/login";
        }
    });
};

export const useUpdateProfile = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            toast.success("Profile updated!");
            qc.invalidateQueries({ queryKey: ["customerProfile"] });
            onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        },
    });
};

export const useSavedData = () =>
    useQuery({
        queryKey: ["savedData"],
        queryFn: () =>
            fetchWithOfflineFallback(getSavedData, "customer-saved", "my-saved-data"),
        staleTime: 1000 * 60 * 10,
        retry: false,
    });

export const useAddAddress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addAddress,
        onSuccess: () => {
            toast.success("Address saved!");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};

export const useDeleteAddress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            toast.success("Address removed.");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};

export const useAddVehicle = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addVehicle,
        onSuccess: () => {
            toast.success("Vehicle saved!");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};

export const useDeleteVehicle = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteVehicle,
        onSuccess: () => {
            toast.success("Vehicle removed.");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};
