import { customerApi } from "../../../app/customer/customerApi";

export const createBooking = async (data: any) => {
    const response = await customerApi.post("/bookings", data);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await customerApi.get("/bookings/my");
    return response.data;
};

export const getServices = async () => {
    const response = await customerApi.get("/services");
    return response.data;
};

export const getAddons = async () => {
    const response = await customerApi.get("/addons");
    return response.data;
};

export const cancelBooking = async (bookingId: string) => {
    const response = await customerApi.patch("/bookings/my/cancel", { bookingId });
    return response.data;
};

export const requestRefund = async (bookingId: string, reason: string) => {
    const response = await customerApi.patch("/bookings/my/refund", { bookingId, reason });
    return response.data;
};

export const updateBookingByCustomer = async (data: any) => {
    const response = await customerApi.patch("/bookings/my/edit", data);
    return response.data;
};
