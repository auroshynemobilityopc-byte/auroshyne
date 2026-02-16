import { api } from "../../lib/apiClient/axios";
import type {
    UserListResponse,
    UserResponse,
} from "./types";

export const getUsersApi = async (params?: any) => {
    const res = await api.get<UserListResponse>("/users", { params });
    return res.data;
};

export const getMeApi = async () => {
    const res = await api.get<UserResponse>("/users/me");
    return res.data.data;
};

export const createUserApi = async (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    role: string;
}) => {
    const res = await api.post<UserResponse>("/users", data);
    return res.data.data;
};

export const updateUserApi = async (
    id: string,
    data: Partial<{ name: string; mobile: string; isActive: boolean }>
) => {
    const res = await api.patch<UserResponse>(`/users/${id}`, data);
    return res.data.data;
};

export const updateMeApi = async (data: {
    name?: string;
    mobile?: string;
}) => {
    const res = await api.patch<UserResponse>("/users/me", data);
    return res.data.data;
};
