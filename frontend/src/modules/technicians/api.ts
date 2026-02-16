import type {
    TechnicianListResponse,
    TechnicianResponse,
} from "./types";
import { api } from "../../lib/apiClient/axios";

export const getTechniciansApi = async (params?: any) => {
    const res = await api.get<TechnicianListResponse>("/technicians", {
        params,
    });
    return res.data;
};

export const createTechnicianApi = async (data: {
    name: string;
    mobile: string;
}) => {
    const res = await api.post<TechnicianResponse>("/technicians", data);
    return res.data.data;
};

export const updateTechnicianApi = async (
    id: string,
    data: Partial<{ name: string; mobile: string; isActive: boolean }>
) => {
    const res = await api.patch<TechnicianResponse>(
        `/technicians/${id}`,
        data
    );
    return res.data.data;
};

export const deleteTechnicianApi = async (id: string) => {
    return api.delete(`/technicians/${id}`);
};
