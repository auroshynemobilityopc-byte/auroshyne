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
    homeServices?: HomeService[];
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
    homeServices?: { serviceId: string; image: string; description: string; }[];
}
