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
}
