import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAddonsApi,
    createAddonApi,
    updateAddonApi,
    getAddonsByVehicleTypeApi,
} from "./api";

export const useAddons = (params?: any) =>
    useQuery({
        queryKey: ["addons", params],
        queryFn: () => getAddonsApi(params),
    });

export const useActiveAddons = () =>
    useQuery({
        queryKey: ["addons-active"],
        queryFn: () => getAddonsApi({ limit: 100 }),
        select: (res) => res.data.filter((a) => a.isActive),
    });

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

export const useAddonsByVehicleType = (vehicleType: string) =>
    useQuery({
        queryKey: ["addons-vehicleType", vehicleType],
        queryFn: () => getAddonsByVehicleTypeApi(vehicleType),
    });
