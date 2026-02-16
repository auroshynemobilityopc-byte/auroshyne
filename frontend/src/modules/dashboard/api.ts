import { api } from "../../lib/apiClient/axios";
import type { DashboardSummaryResponse } from "./types";

export const getDashboardSummaryApi = async () => {
    const res = await api.get<DashboardSummaryResponse>("/dashboard/summary");
    return res.data.data;
};
