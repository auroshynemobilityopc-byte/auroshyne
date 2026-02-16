export type VehicleType = "2W" | "4W" | "CAB";

export interface Service {
    _id: string;
    name: string;
    vehicleType: VehicleType;
    price: number;
    description?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceListResponse {
    success: boolean;
    data: Service[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface ServiceResponse {
    success: boolean;
    data: Service;
}
