export type Slot = "MORNING" | "AFTERNOON" | "EVENING";

export interface AssignedSlot {
    date: string;
    slot: Slot;
}

export interface Technician {
    _id: string;
    name: string;
    mobile: string;
    isActive: boolean;
    assignedSlots: AssignedSlot[];
    createdAt?: string;
    updatedAt?: string;
}

export interface TechnicianListResponse {
    success: boolean;
    data: Technician[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface TechnicianResponse {
    success: boolean;
    data: Technician;
}
