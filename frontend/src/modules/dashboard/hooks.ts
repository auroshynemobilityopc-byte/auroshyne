import { useQuery } from "@tanstack/react-query";
import { getDashboardSummaryApi } from "./api";

export const useDashboardSummary = () =>
    useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: getDashboardSummaryApi,
        refetchInterval: 30000, // 30s polling
        staleTime: 15000,
    });
