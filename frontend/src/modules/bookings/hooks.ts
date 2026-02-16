import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    getBookingsApi,
    assignTechnicianApi,
    updateBookingStatusApi,
    updatePaymentApi,
    getBookingByIdApi,
} from "./api";
import type { BookingListResponse } from "./types";

export const useBookings = (params: any) =>
    useQuery({
        queryKey: ["bookings", params],
        queryFn: () => getBookingsApi(params),
    });

export const useAssignTechnician = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: assignTechnicianApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
    });
};

export const useUpdateStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateBookingStatusApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
    });
};

export const useUpdatePayment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updatePaymentApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
    });
};

export const useBookingsInfinite = (filters: any) =>
    useInfiniteQuery<BookingListResponse>({
        queryKey: ["bookings-infinite", filters],
        initialPageParam: 1, // ✅ REQUIRED in v5
        queryFn: ({ pageParam }) =>
            getBookingsApi({
                ...filters,
                page: pageParam,
                limit: 10,
            }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
    });

export const useBookingDetails = (id?: string) =>
    useQuery({
        queryKey: ["booking-details", id],
        queryFn: () => getBookingByIdApi(id!),
        enabled: !!id,
    });
