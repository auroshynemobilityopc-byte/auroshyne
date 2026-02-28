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
