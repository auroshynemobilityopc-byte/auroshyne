/**
 * Enhanced Offline-First Profile Hooks
 * Automatically cache profile and saved data, restore when offline
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile, getSavedData, addAddress, deleteAddress, addVehicle, deleteVehicle } from "./api";
import { saveToIndexedDB, getFromIndexedDB } from "../../../lib/indexedDB";
import { useOffline } from "../../../lib/OfflineContext";
import toast from "react-hot-toast";

/**
 * Fetch profile with offline caching
 */
export const useMyProfileOffline = () => {
    const { isOffline, updateLastSync } = useOffline();

    return useQuery({
        queryKey: ["customerProfile"],
        queryFn: async () => {
            if (isOffline) {
                const cached = await getFromIndexedDB('customers', 'my-profile');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw new Error('No offline profile data available');
            }

            try {
                const data = await getMyProfile();
                await saveToIndexedDB('customers', 'my-profile', data);
                updateLastSync(Date.now());
                return data;
            } catch (error) {
                const cached = await getFromIndexedDB('customers', 'my-profile');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: !isOffline ? 2 : 0,
    });
};

/**
 * Fetch saved data (addresses, vehicles) with offline caching
 */
export const useSavedDataOffline = () => {
    const { isOffline, updateLastSync } = useOffline();

    return useQuery({
        queryKey: ["savedData"],
        queryFn: async () => {
            if (isOffline) {
                const cached = await getFromIndexedDB('customers', 'saved-data');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw new Error('No offline saved data');
            }

            try {
                const data = await getSavedData();
                await saveToIndexedDB('customers', 'saved-data', data);
                updateLastSync(Date.now());
                return data;
            } catch (error) {
                const cached = await getFromIndexedDB('customers', 'saved-data');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: !isOffline ? 2 : 0,
    });
};

/**
 * Update profile - Disabled when offline
 */
export const useUpdateProfileOffline = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: (data: any) => {
            if (isOffline) {
                throw new Error('Cannot update profile while offline');
            }
            return updateMyProfile(data);
        },
        onSuccess: () => {
            toast.success("Profile updated!");
            qc.invalidateQueries({ queryKey: ["customerProfile"] });
            onSuccess?.();
        },
        onError: (err: any) => {
            if (isOffline) {
                toast.error("Cannot update profile while offline");
            } else {
                toast.error(err?.response?.data?.message || "Failed to update profile");
            }
        },
    });
};

/**
 * Add address - Disabled when offline
 */
export const useAddAddressOffline = () => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: (data: any) => {
            if (isOffline) {
                throw new Error('Cannot add address while offline');
            }
            return addAddress(data);
        },
        onSuccess: () => {
            toast.success("Address saved!");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => {
            if (isOffline) {
                toast.error("Cannot add address while offline");
            } else {
                toast.error(e?.response?.data?.message || "Failed");
            }
        },
    });
};

/**
 * Delete address - Disabled when offline
 */
export const useDeleteAddressOffline = () => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: (addressId: string) => {
            if (isOffline) {
                throw new Error('Cannot delete address while offline');
            }
            return deleteAddress(addressId);
        },
        onSuccess: () => {
            toast.success("Address removed.");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => {
            if (isOffline) {
                toast.error("Cannot delete address while offline");
            } else {
                toast.error(e?.response?.data?.message || "Failed");
            }
        },
    });
};

/**
 * Add vehicle - Disabled when offline
 */
export const useAddVehicleOffline = () => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: (data: any) => {
            if (isOffline) {
                throw new Error('Cannot add vehicle while offline');
            }
            return addVehicle(data);
        },
        onSuccess: () => {
            toast.success("Vehicle saved!");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => {
            if (isOffline) {
                toast.error("Cannot add vehicle while offline");
            } else {
                toast.error(e?.response?.data?.message || "Failed");
            }
        },
    });
};

/**
 * Delete vehicle - Disabled when offline
 */
export const useDeleteVehicleOffline = () => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: (vehicleId: string) => {
            if (isOffline) {
                throw new Error('Cannot delete vehicle while offline');
            }
            return deleteVehicle(vehicleId);
        },
        onSuccess: () => {
            toast.success("Vehicle removed.");
            qc.invalidateQueries({ queryKey: ["savedData"] });
        },
        onError: (e: any) => {
            if (isOffline) {
                toast.error("Cannot delete vehicle while offline");
            } else {
                toast.error(e?.response?.data?.message || "Failed");
            }
        },
    });
};
