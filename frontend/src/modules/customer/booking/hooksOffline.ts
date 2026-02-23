/**
 * Enhanced Offline-First Hooks for Customer App
 * These hooks automatically save data to IndexedDB and restore from cache when offline
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBookings, getServices, getAddons, cancelBooking, requestRefund, updateBookingByCustomer } from "./api";
import { saveToIndexedDB, getFromIndexedDB } from "../../../lib/indexedDB";
import { useOffline } from "../../../lib/OfflineContext";
import toast from "react-hot-toast";

/**
 * Fetch bookings with offline caching
 */
export const useMyBookingsOffline = () => {
    const { isOffline, updateLastSync } = useOffline();

    return useQuery({
        queryKey: ["myBookings"],
        queryFn: async () => {
            // If offline, try to load from IndexedDB
            if (isOffline) {
                const cached = await getFromIndexedDB('bookings', 'my-bookings');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw new Error('No offline data available');
            }

            // Online: fetch from API
            try {
                const data = await getMyBookings();
                // Save to IndexedDB for offline use
                await saveToIndexedDB('bookings', 'my-bookings', data);
                updateLastSync(Date.now());
                return data;
            } catch (error) {
                // On error, try to load cached data
                const cached = await getFromIndexedDB('bookings', 'my-bookings');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: !isOffline ? 2 : 0,
    });
};

/**
 * Fetch services with offline caching
 */
export const useServicesOffline = () => {
    const { isOffline, updateLastSync } = useOffline();

    return useQuery({
        queryKey: ["services"],
        queryFn: async () => {
            if (isOffline) {
                const cached = await getFromIndexedDB('services', 'all-services');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw new Error('No offline data available');
            }

            try {
                const data = await getServices();
                await saveToIndexedDB('services', 'all-services', data);
                updateLastSync(Date.now());
                return data;
            } catch (error) {
                const cached = await getFromIndexedDB('services', 'all-services');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw error;
            }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 1 * 60 * 60 * 1000, // 1 hour
        retry: !isOffline ? 2 : 0,
    });
};

/**
 * Fetch addons with offline caching
 */
export const useAddonsOffline = () => {
    const { isOffline, updateLastSync } = useOffline();

    return useQuery({
        queryKey: ["addons"],
        queryFn: async () => {
            if (isOffline) {
                const cached = await getFromIndexedDB('services', 'all-addons');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw new Error('No offline data available');
            }

            try {
                const data = await getAddons();
                await saveToIndexedDB('services', 'all-addons', data);
                updateLastSync(Date.now());
                return data;
            } catch (error) {
                const cached = await getFromIndexedDB('services', 'all-addons');
                if (cached && 'data' in cached) {
                    return cached.data as any;
                }
                throw error;
            }
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 1 * 60 * 60 * 1000,
        retry: !isOffline ? 2 : 0,
    });
};

/**
 * Cancel booking - Disabled when offline
 */
export const useCancelBookingOffline = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: ({ bookingId }: { bookingId: string }) => {
            if (isOffline) {
                throw new Error('Cannot cancel booking while offline');
            }
            return cancelBooking(bookingId);
        },
        onSuccess: () => {
            toast.success("Booking cancelled.");
            qc.invalidateQueries({ queryKey: ["myBookings"] });
            onSuccess?.();
        },
        onError: (error: any) => {
            if (isOffline) {
                toast.error("Cannot cancel bookings while offline");
            } else {
                toast.error(error.response?.data?.message || "Failed to cancel booking");
            }
        },
    });
};

/**
 * Request refund - Disabled when offline
 */
export const useRequestRefundOffline = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) => {
            if (isOffline) {
                throw new Error('Cannot request refund while offline');
            }
            return requestRefund(bookingId, reason);
        },
        onSuccess: () => {
            toast.success("Refund requested.");
            qc.invalidateQueries({ queryKey: ["myBookings"] });
            onSuccess?.();
        },
        onError: (error: any) => {
            if (isOffline) {
                toast.error("Cannot request refunds while offline");
            } else {
                toast.error(error.response?.data?.message || "Failed to request refund");
            }
        },
    });
};

/**
 * Update booking - Disabled when offline
 */
export const useUpdateBookingOffline = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    const { isOffline } = useOffline();

    return useMutation({
        mutationFn: (data: any) => {
            if (isOffline) {
                throw new Error('Cannot update booking while offline');
            }
            return updateBookingByCustomer(data);
        },
        onSuccess: () => {
            toast.success("Booking updated.");
            qc.invalidateQueries({ queryKey: ["myBookings"] });
            onSuccess?.();
        },
        onError: (error: any) => {
            if (isOffline) {
                toast.error("Cannot update bookings while offline");
            } else {
                toast.error(error.response?.data?.message || "Failed to update booking");
            }
        },
    });
};
