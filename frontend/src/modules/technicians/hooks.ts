import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createTechnicianApi,
    updateTechnicianApi,
} from "./api";
import { useOfflineCachedQuery } from "../../lib/useOfflineCachedQuery";
import type { TechnicianListResponse } from "./types";

export const useTechnicians = (params?: any) => {
    const qs = params
        ? new URLSearchParams(
            Object.entries(params)
                .filter(([_, v]) => v !== undefined && v !== null && v !== "")
                .map(([k, v]) => [k, String(v)])
        ).toString()
        : "";

    return useOfflineCachedQuery<TechnicianListResponse>(
        `/technicians${qs ? `?${qs}` : ""}`,
        "technicians",
        qs ? `technicians-${qs}` : "technicians-all"
    );
};

export const useActiveTechnicians = () => {
    const query = useOfflineCachedQuery<TechnicianListResponse>(
        "/technicians?isActive=true&limit=100",
        "technicians",
        "technicians-active=true"
    );

    return {
        ...query,
        data: query.data?.data || []
    };
};

export const useCreateTechnician = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createTechnicianApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["technicians"] }),
    });
};

export const useUpdateTechnician = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: any) =>
            updateTechnicianApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["technicians"] }),
    });
};
