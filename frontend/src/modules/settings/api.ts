import { api } from "../../lib/apiClient/axios";
import type { SettingResponse, UpdateSettingPayload } from "./types";

export const getSettingsApi = async () => {
    const res = await api.get<SettingResponse>("/settings");
    return res.data.data;
};

export const updateSettingsApi = async (data: UpdateSettingPayload) => {
    const res = await api.patch<SettingResponse>("/settings", data);
    return res.data.data;
};

export const uploadGalleryImageApi = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};
