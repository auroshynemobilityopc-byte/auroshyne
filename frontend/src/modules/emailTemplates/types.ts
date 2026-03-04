export interface EmailTemplate {
    _id: string;
    name: string;
    subject: string;
    body: string;
    placeholders?: string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface EmailTemplateResponse {
    success: boolean;
    data: EmailTemplate;
}

export interface EmailTemplatesResponse {
    success: boolean;
    data: EmailTemplate[];
}

export interface CreateEmailTemplatePayload {
    name: string;
    subject: string;
    body: string;
    placeholders?: string[];
    isActive?: boolean;
}

export interface UpdateEmailTemplatePayload {
    name?: string;
    subject?: string;
    body?: string;
    placeholders?: string[];
    isActive?: boolean;
}
