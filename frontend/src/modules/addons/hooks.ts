import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createAddonApi,
    updateAddonApi,
} from "./api";
import { useOfflineCachedQuery } from "../../lib/useOfflineCachedQuery";
import type { AddonListResponse } from "./types";

export const useAddons = (params?: any) => {
    const qs = params
        ? new URLSearchParams(
            Object.entries(params)
                .filter(([_, v]) => v !== undefined && v !== null && v !== "")
                .map(([k, v]) => [k, String(v)])
        ).toString()
        : "";

    return useOfflineCachedQuery<AddonListResponse>(
        `/addons${qs ? `?${qs}` : ""}`,
        "addons",
        qs ? `addons-${qs}` : "addons-all"
    );
};

export const useActiveAddons = () => {
    const query = useOfflineCachedQuery<AddonListResponse>(
        "/addons?limit=100",
        "addons",
        "addons-limit=100"
    );

    return {
        ...query,
        data: query.data?.data?.filter((a: any) => a.isActive) || []
    };
};

export const useCreateAddon = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createAddonApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["addons"] }),
    });
};

export const useUpdateAddon = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: any) =>
            updateAddonApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["addons"] }),
    });
};

export const useAddonsByVehicleType = (vehicleType: string) => {
    const query = useOfflineCachedQuery<AddonListResponse>(
        `/addons/vehicleType/${vehicleType}`,
        "addons",
        `addons-vehicleType-${vehicleType}`
    );

    return {
        ...query,
        data: query.data?.data || []
    };
};
