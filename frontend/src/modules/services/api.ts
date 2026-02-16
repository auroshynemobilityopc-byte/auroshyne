import { api } from "../../lib/apiClient/axios";
import type {
    ServiceListResponse,
    ServiceResponse,
} from "./types";

export const getServicesApi = async (params?: any) => {
    const res = await api.get<ServiceListResponse>("/services", { params });
    return res.data;
};

export const createServiceApi = async (data: {
    name: string;
    vehicleType: string;
    price: number;
    description?: string;
}) => {
    const res = await api.post<ServiceResponse>("/services", data);
    return res.data.data;
};

export const updateServiceApi = async (
    id: string,
    data: Partial<{
        name: string;
        vehicleType: string;
        price: number;
        description: string;
        isActive: boolean;
    }>
) => {
    const res = await api.patch<ServiceResponse>(`/services/${id}`, data);
    return res.data.data;
};
