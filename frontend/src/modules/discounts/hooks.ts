import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDiscountsApi, createDiscountApi, updateDiscountApi } from "./api";

export const useDiscounts = (params?: any) => {
    return useQuery({
        queryKey: ["discounts", params],
        queryFn: () => getDiscountsApi(params),
    });
};

export const useCreateDiscount = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createDiscountApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["discounts"] }),
    });
};

export const useUpdateDiscount = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateDiscountApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["discounts"] }),
    });
};
