import { api } from "../../lib/apiClient/axios";

export const getDiscountsApi = async (params: any) => {
    const res = await api.get('/discounts', { params });
    return res.data;
};

export const createDiscountApi = async (data: any) => {
    const res = await api.post('/discounts', data);
    return res.data;
};

export const updateDiscountApi = async ({ id, data }: { id: string; data: any }) => {
    const res = await api.patch(`/discounts/${id}`, data);
    return res.data;
};
export const validateDiscountApi = async (data: { code: string; orderValue: number }) => {
    const res = await api.post('/discounts/validate', data);
    return res.data;
};
