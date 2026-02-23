import { customerApi } from "../../../app/customer/customerApi";

export const getMyProfile = async () => {
    const response = await customerApi.get("/users/me");
    return response.data;
};

export const logoutCustomer = async () => {
    const response = await customerApi.post("/auth/logout");
    return response.data;
};

export const updateMyProfile = async (data: { name?: string; mobile?: string; email?: string }) => {
    const response = await customerApi.patch("/users/me", data);
    return response.data;
};

export const getSavedData = async () => {
    const response = await customerApi.get("/users/me/saved");
    return response.data;
};

export const addAddress = async (data: { label: string; address: string; apartmentName?: string; mobile?: string }) => {
    const response = await customerApi.post("/users/me/addresses", data);
    return response.data;
};

export const deleteAddress = async (id: string) => {
    const response = await customerApi.delete(`/users/me/addresses/${id}`);
    return response.data;
};

export const addVehicle = async (data: { label?: string; number: string; type: string; model?: string }) => {
    const response = await customerApi.post("/users/me/vehicles", data);
    return response.data;
};

export const deleteVehicle = async (id: string) => {
    const response = await customerApi.delete(`/users/me/vehicles/${id}`);
    return response.data;
};
