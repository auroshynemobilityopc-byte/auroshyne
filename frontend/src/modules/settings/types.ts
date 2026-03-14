export interface HomeService {
    serviceId: any;
    image: string;
    description: string;
}

export interface AutoEmailTrigger {
    enabled: boolean;
    templateId: string | null;
}

export interface AutoEmails {
    newBooking:        AutoEmailTrigger;
    newRegistration:   AutoEmailTrigger;
    bookingCompleted:  AutoEmailTrigger;
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
    bulkDiscount?: {
        twoVehicles: number;
        threeOrMoreVehicles: number;
    };
    videoLink: string;
    whatsappNumber?: string;
    showWhatsapp?: boolean;
    isBookingClosed: boolean;
    bookingClosedMessage: string;
    restrictToCity?: boolean;
    allowedCity?: string;
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
    autoEmails?: AutoEmails;
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
    bulkDiscount?: {
        twoVehicles: number;
        threeOrMoreVehicles: number;
    };
    videoLink?: string;
    whatsappNumber?: string;
    showWhatsapp?: boolean;
    isBookingClosed?: boolean;
    bookingClosedMessage?: string;
    restrictToCity?: boolean;
    allowedCity?: string;
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
    autoEmails?: {
        newBooking?:       { enabled?: boolean; templateId?: string | null };
        newRegistration?:  { enabled?: boolean; templateId?: string | null };
        bookingCompleted?: { enabled?: boolean; templateId?: string | null };
    };
}
