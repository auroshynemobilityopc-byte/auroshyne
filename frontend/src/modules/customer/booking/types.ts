export type VehicleCategory = "private" | "commercial";
export type VehicleType = "two-wheeler" | "four-wheeler" | "cab";
export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Vehicle {
    id: string;
    number: string;
    model: string;
    cc: string;
    type: VehicleType;
    image?: File | null;
    serviceId?: string | null;
    addonIds?: string[];
}

export interface BookingState {
    category: VehicleCategory | null;
    type: VehicleType | null;
    vehicles: Vehicle[];
    serviceId: string | null;
    addonIds: string[];
    date: Date | null;
    slotId: string | null;
    address: {
        house: string;
        street: string;
        mobile: string;
    };
    paymentMode: "online" | "cash" | "upi" | null;
    isBulkBooking: boolean;
    discountCode: string | null;
    discountValue: number;
}

export interface StepProps {
    booking: BookingState;
    updateBooking: (updates: Partial<BookingState>) => void;
    services?: any[];
    addons?: any[];
    loadingServices?: boolean;
    loadingAddons?: boolean;
    totalEstimate?: number;
}
