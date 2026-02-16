import { api } from "../../lib/apiClient/axios";
import type {
    AddonListResponse,
    AddonResponse,
} from "./types";

export const getAddonsApi = async (params?: any) => {
    const res = await api.get<AddonListResponse>("/addons", { params });
    return res.data;
};

export const createAddonApi = async (data: {
    name: string;
    price: number;
    vehicleType: string;
}) => {
    const res = await api.post<AddonResponse>("/addons", data);
    return res.data.data;
};

export const updateAddonApi = async (
    id: string,
    data: Partial<{ name: string; price: number; isActive: boolean; vehicleType: string }>
) => {
    const res = await api.patch<AddonResponse>(`/addons/${id}`, data);
    return res.data.data;
};

export const getAddonsByVehicleTypeApi = async (vehicleType: string) => {
    const res = await api.get<AddonListResponse>(`/addons/vehicleType/${vehicleType}`);
    return res.data;
};
