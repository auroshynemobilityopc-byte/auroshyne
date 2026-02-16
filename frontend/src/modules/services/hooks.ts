import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getServicesApi,
    createServiceApi,
    updateServiceApi,
} from "./api";

export const useServices = (params?: any) =>
    useQuery({
        queryKey: ["services", params],
        queryFn: () => getServicesApi(params),
    });

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
