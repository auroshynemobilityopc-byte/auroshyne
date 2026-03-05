export interface HomeService {
    serviceId: any;
    image: string;
    description: string;
}

export interface Setting {
    _id?: string;
    slotsCount: {
        morning: number;
        afternoon: number;
        evening: number;
    };
    bookingDays: number;
    taxPercentage: number;
    videoLink: string;
    isBookingClosed: boolean;
    bookingClosedMessage: string;
    galleryImages?: string[];
    homeServices?: HomeService[];
    emailSettings?: {
        provider: 'disabled' | 'nodemailer' | 'resend';
        fromEmail: string;
        fromName: string;
        nodemailer?: {
            host: string;
            port: number | '';
            user: string;
            pass: string;
        };
        resend?: {
            apiKey: string;
        };
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface SettingResponse {
    success: boolean;
    data: Setting;
}

export interface UpdateSettingPayload {
    slotsCount?: {
        morning?: number;
        afternoon?: number;
        evening?: number;
    };
    bookingDays?: number;
    taxPercentage?: number;
    videoLink?: string;
    isBookingClosed?: boolean;
    bookingClosedMessage?: string;
    galleryImages?: string[];
    homeServices?: { serviceId: string; image: string; description: string; }[];
    emailSettings?: {
        provider: 'disabled' | 'nodemailer' | 'resend';
        fromEmail: string;
        fromName: string;
        nodemailer?: {
            host: string;
            port: number | '';
            user: string;
            pass: string;
        };
        resend?: {
            apiKey: string;
        };
    };
}
