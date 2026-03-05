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

export const validateDiscount = async (data: { code: string; orderValue: number }) => {
    const response = await customerApi.post("/discounts/validate", data);
    return response.data;
};

export const createCashfreeOrderApi = async (bookingId: string) => {
    const response = await customerApi.post("/bookings/payment/create-order", { bookingId });
    return response.data;
};

export const verifyCashfreePaymentApi = async (orderId: string) => {
    const response = await customerApi.post("/bookings/payment/verify", { orderId });
    return response.data;
};

export const deleteFailedBookingApi = async (bookingId: string) => {
    const response = await customerApi.delete(`/bookings/payment/failed-booking/${bookingId}`);
    return response.data;
};

export const checkSlotAvailabilityApi = async (date: string, slot: string, vehicleNumbers: string[] = []) => {
    const params = vehicleNumbers.length > 0 ? `?vehicles=${vehicleNumbers.join(',')}` : '';
    const response = await customerApi.get(`/bookings/slot-availability/${date}/${slot}${params}`);
    return response.data;
};
