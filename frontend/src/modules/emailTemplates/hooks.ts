import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/apiClient/axios";
import type {
    EmailTemplatesResponse,
    EmailTemplateResponse,
    CreateEmailTemplatePayload,
    UpdateEmailTemplatePayload
} from "./types";

export const getTemplatesApi = async () => {
    const res = await api.get<EmailTemplatesResponse>("/email-templates");
    return res.data.data;
};

export const getTemplateByIdApi = async (id: string) => {
    const res = await api.get<EmailTemplateResponse>(`/email-templates/${id}`);
    return res.data.data;
};

export const createTemplateApi = async (data: CreateEmailTemplatePayload) => {
    const res = await api.post<EmailTemplateResponse>("/email-templates", data);
    return res.data;
};

export const updateTemplateApi = async ({ id, data }: { id: string; data: UpdateEmailTemplatePayload }) => {
    const res = await api.patch<EmailTemplateResponse>(`/email-templates/${id}`, data);
    return res.data;
};

export const deleteTemplateApi = async (id: string) => {
    const res = await api.delete(`/email-templates/${id}`);
    return res.data;
};

// Hooks
export const useTemplates = () => {
    return useQuery({
        queryKey: ["email-templates"],
        queryFn: getTemplatesApi,
    });
};

export const useTemplate = (id: string) => {
    return useQuery({
        queryKey: ["email-templates", id],
        queryFn: () => getTemplateByIdApi(id),
        enabled: !!id,
    });
};

export const useCreateTemplate = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createTemplateApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["email-templates"] }),
    });
};

export const useUpdateTemplate = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateTemplateApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["email-templates"] }),
    });
};

export const useDeleteTemplate = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteTemplateApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["email-templates"] }),
    });
};
