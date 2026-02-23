import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBooking, getMyBookings, getServices, getAddons, cancelBooking, requestRefund, updateBookingByCustomer } from "./api";
import toast from "react-hot-toast";

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
        queryFn: getMyBookings,
    });
};

export const useServices = () => {
    return useQuery({
        queryKey: ["services"],
        queryFn: getServices,
    });
};

export const useAddons = () => {
    return useQuery({
        queryKey: ["addons"],
        queryFn: getAddons,
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
