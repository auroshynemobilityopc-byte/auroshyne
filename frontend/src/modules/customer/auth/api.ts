import { customerApi } from "../../../app/customer/customerApi";

export const login = async (data: { email: string; password: string }) => {
    const response = await customerApi.post("/auth/login", data);
    return response.data;
};

export const register = async (data: { name: string; email: string; mobile: string; password: string }) => {
    const response = await customerApi.post("/auth/register", data);
    return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
    const response = await customerApi.post("/auth/forgot-password", data);
    return response.data;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
    const response = await customerApi.post("/auth/reset-password", data);
    return response.data;
};
