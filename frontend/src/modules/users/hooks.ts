import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getUsersApi,
    createUserApi,
    updateUserApi,
    getMeApi,
    updateMeApi,
} from "./api";

export const useUsers = (params?: any) =>
    useQuery({
        queryKey: ["users", params],
        queryFn: () => getUsersApi(params),
    });

export const useCreateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createUserApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
    });
};

export const useUpdateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: any) => updateUserApi(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
    });
};

export const useMe = () =>
    useQuery({
        queryKey: ["me"],
        queryFn: getMeApi,
    });

export const useUpdateMe = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateMeApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
    });
};
