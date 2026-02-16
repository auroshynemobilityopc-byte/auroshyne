import { api } from "../../lib/apiClient/axios";
import type {
    BookingListResponse,
    BookingDetailsResponse,
} from "./types";

export const getBookingsApi = async (params: any) => {
    const res = await api.get<BookingListResponse>("/bookings", { params });
    return res.data;
};

export const getBookingByIdApi = async (id: string) => {
    const res = await api.get<BookingDetailsResponse>(`/bookings/${id}`);
    return res.data.data;
};

export const assignTechnicianApi = async (data: {
    bookingId: string;
    technicianId: string;
}) => {
    return api.patch("/bookings/assign-technician", data);
};

export const updateBookingStatusApi = async (data: {
    bookingId: string;
    status: string;
}) => {
    return api.patch("/bookings/status", data);
};

export const updatePaymentApi = async (data: {
    bookingId: string;
    method: string;
    status: string;
    transactionId?: string;
}) => {
    return api.patch("/payments", data);
};

export const getSlotBookingsApi = async (date: string, slot: string) => {
    const res = await api.get(`/bookings/slot/${date}/${slot}`);
    return res.data.data;
};
