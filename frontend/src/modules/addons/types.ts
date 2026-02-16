export interface Addon {
    _id: string;
    name: string;
    price: number;
    vehicleType: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddonListResponse {
    success: boolean;
    data: Addon[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface AddonResponse {
    success: boolean;
    data: Addon;
}
