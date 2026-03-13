import { api } from "../../lib/apiClient/axios";

export interface EmailTemplate {
    _id: string;
    name: string;
    subject: string;
    body: string;
    placeholders: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getAllTemplatesApi = async (): Promise<EmailTemplate[]> => {
    const res = await api.get("/email-templates");
    return res.data.data;
};

export const createTemplateApi = async (data: Omit<EmailTemplate, "_id" | "createdAt" | "updatedAt">): Promise<EmailTemplate> => {
    const res = await api.post("/email-templates", data);
    return res.data.data;
};

export const updateTemplateApi = async (id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    const res = await api.patch(`/email-templates/${id}`, data);
    return res.data.data;
};

export const deleteTemplateApi = async (id: string): Promise<void> => {
    await api.delete(`/email-templates/${id}`);
};
