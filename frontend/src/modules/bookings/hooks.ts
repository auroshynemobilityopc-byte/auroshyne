import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    getBookingsApi,
    assignTechnicianApi,
    updateBookingStatusApi,
    updatePaymentApi,
    getBookingByIdApi,
    createBookingApi,
} from "./api";
import type { BookingListResponse } from "./types";
import { getFromIndexedDB, saveToIndexedDB } from "../../lib/indexedDB";

/* ─── Shared query-key builder ─────────────────────────────────────────────── */

const buildBookingsQs = (params: Record<string, any>) =>
    new URLSearchParams(
        Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => [k, String(v)])
    ).toString();

/* ─── useBookings (desktop paginated table) ────────────────────────────────── */

export const useBookings = (params: any) => {
    const qs = buildBookingsQs(params);
    const queryKey = ["bookings", qs];

    return useQuery<BookingListResponse>({
        queryKey,
        queryFn: async () => {
            const fetchKey = qs ? `bookings-${qs}` : "bookings-all";

            if (!navigator.onLine) {
                const cachedData = await getFromIndexedDB("bookings", fetchKey);
                // @ts-ignore
                if (cachedData && "data" in cachedData) return cachedData.data as BookingListResponse;
                throw new Error("Offline and no data cached");
            }

            const data = await getBookingsApi(params);
            await saveToIndexedDB("bookings", fetchKey, data);
            await saveToIndexedDB("app-state", "global-sync", { lastSyncedAt: Date.now() });
            return data;
        },
        staleTime: 30_000, // 30 s — keep fresh for normal browsing
        placeholderData: (prev) => prev, // keep old rows visible while fetching new page
    });
};

/* ─── useBookingsInfinite (mobile list) ─────────────────────────────────────── */

export const useBookingsInfinite = (filters: any) =>
    useInfiniteQuery<BookingListResponse>({
        queryKey: ["bookings-infinite", filters],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const params = { ...filters, page: pageParam, limit: 10 };
            const qs = buildBookingsQs(params);
            const fetchKey = qs ? `bookings-${qs}` : "bookings-all";

            if (!navigator.onLine) {
                const cachedData = await getFromIndexedDB("bookings", fetchKey);
                // @ts-ignore
                if (cachedData && "data" in cachedData) return cachedData.data as BookingListResponse;
                throw new Error("Offline and no data cached");
            }

            const data = await getBookingsApi(params);
            await saveToIndexedDB("bookings", fetchKey, data);
            await saveToIndexedDB("app-state", "global-sync", { lastSyncedAt: Date.now() });

            return data;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage?.pagination) return undefined;
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
    });

/* ─── Mutation hooks ─────────────────────────────────────────────────────────── */

export const useCreateBooking = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createBookingApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["bookings"] });
            qc.invalidateQueries({ queryKey: ["bookings-infinite"] });
            onSuccess?.();
        },
    });
};

export const useAssignTechnician = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: assignTechnicianApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["bookings"] });
            qc.invalidateQueries({ queryKey: ["bookings-infinite"] });
            onSuccess?.();
        },
    });
};

export const useUpdateStatus = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateBookingStatusApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["bookings"] });
            qc.invalidateQueries({ queryKey: ["bookings-infinite"] });
            onSuccess?.();
        },
    });
};

export const useUpdatePayment = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updatePaymentApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["bookings"] });
            qc.invalidateQueries({ queryKey: ["bookings-infinite"] });
            onSuccess?.();
        },
    });
};

/* ─── useBookingDetails ──────────────────────────────────────────────────────── */

export const useBookingDetails = (id?: string) =>
    useQuery({
        queryKey: ["booking-details", id],
        queryFn: () => getBookingByIdApi(id!),
        enabled: !!id,
    });
