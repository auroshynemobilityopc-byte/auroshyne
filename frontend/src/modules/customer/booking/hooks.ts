import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBooking, getMyBookings, getServices, getAddons, cancelBooking, requestRefund, updateBookingByCustomer } from "./api";
import toast from "react-hot-toast";
import { saveCustomerData, getCustomerData } from "../../../lib/customerIndexedDB";

// ─── Offline-aware fetch helpers ──────────────────────────────────────────────

const fetchWithOfflineFallback = async <T>(
    fetchFn: () => Promise<T>,
    store: 'customer-bookings' | 'customer-services' | 'customer-addons',
    cacheKey: string
): Promise<T> => {
    if (!navigator.onLine) {
        const cached = await getCustomerData(store, cacheKey);
        if (cached) return cached.data as T;
        throw new Error("You are offline and no cached data is available.");
    }
    try {
        const result = await fetchFn();
        // Persist latest data for offline use
        await saveCustomerData(store, cacheKey, result);
        return result;
    } catch (err: any) {
        // Network error even though navigator.onLine was true (e.g. no signal on mobile)
        if (!err?.response) {
            const cached = await getCustomerData(store, cacheKey);
            if (cached) return cached.data as T;
        }
        throw err;
    }
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useCreateBooking = () => {
    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            toast.success("Booking created successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create booking");
        },
    });
};

export const useMyBookings = () => {
    return useQuery({
        queryKey: ["myBookings"],
        queryFn: () =>
            fetchWithOfflineFallback(getMyBookings, "customer-bookings", "my-bookings-list"),
        // Keep stale data visible while revalidating
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,             // Don't retry on offline; we already handle the fallback
    });
};

export const useServices = () => {
    return useQuery({
        queryKey: ["services"],
        queryFn: () =>
            fetchWithOfflineFallback(getServices, "customer-services", "services-list"),
        staleTime: 1000 * 60 * 30, // 30 minutes — services change rarely
        retry: false,
    });
};

export const useAddons = () => {
    return useQuery({
        queryKey: ["addons"],
        queryFn: () =>
            fetchWithOfflineFallback(getAddons, "customer-addons", "addons-list"),
        staleTime: 1000 * 60 * 30,
        retry: false,
    });
};

export const useCancelBooking = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId }: { bookingId: string }) => cancelBooking(bookingId),
        onSuccess: () => {
            toast.success("Booking cancelled.");
            qc.invalidateQueries({ queryKey: ["myBookings"] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to cancel booking");
        },
    });
};

export const useRequestRefund = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
            requestRefund(bookingId, reason),
        onSuccess: () => {
            toast.success("Refund requested.");
            qc.invalidateQueries({ queryKey: ["myBookings"] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to request refund");
        },
    });
};

export const useUpdateBooking = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => updateBookingByCustomer(data),
        onSuccess: () => {
            toast.success("Booking updated.");
            qc.invalidateQueries({ queryKey: ["myBookings"] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update booking");
        },
    });
};
