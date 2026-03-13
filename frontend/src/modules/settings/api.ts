import { api } from "../../lib/apiClient/axios";
import { customerApi } from "../../app/customer/customerApi";
import type { SettingResponse, UpdateSettingPayload } from "./types";

// Helper to get the correct API instance based on context
const getApi = () => {
    return window.location.pathname.startsWith("/admin") ? api : customerApi;
};

export const getSettingsApi = async () => {
    const res = await getApi().get<SettingResponse>("/settings");
    return res.data.data;
};

export const updateSettingsApi = async (data: UpdateSettingPayload) => {
    const res = await api.patch<SettingResponse>("/settings", data);
    return res.data.data;
};

export const uploadGalleryImageApi = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await getApi().post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};
