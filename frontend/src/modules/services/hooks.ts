import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createServiceApi,
    updateServiceApi,
} from "./api";

import { useOfflineCachedQuery } from "../../lib/useOfflineCachedQuery";
import type { ServiceListResponse } from "./types";

export const useServices = (params?: any) => {
    const qs = params
        ? new URLSearchParams(
            Object.entries(params)
                .filter(([_, v]) => v !== undefined && v !== null && v !== "")
                .map(([k, v]) => [k, String(v)])
        ).toString()
        : "";

    return useOfflineCachedQuery<ServiceListResponse>(
        `/services${qs ? `?${qs}` : ""}`,
        "services",
        qs ? `services-${qs}` : "services-all"
    );
};

export const useCreateService = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createServiceApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
    });
};

export const useUpdateService = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: any) =>
            updateServiceApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
    });
};
