import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getTechniciansApi,
    createTechnicianApi,
    updateTechnicianApi,
} from "./api";

export const useTechnicians = (params?: any) =>
    useQuery({
        queryKey: ["technicians", params],
        queryFn: () => getTechniciansApi(params),
    });

export const useActiveTechnicians = () =>
    useQuery({
        queryKey: ["technicians-active"],
        queryFn: () => getTechniciansApi({ isActive: true, limit: 100 }),
        select: (res) => res.data,
    });

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
