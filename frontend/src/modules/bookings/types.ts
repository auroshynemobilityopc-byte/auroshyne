export type Slot = "MORNING" | "AFTERNOON" | "EVENING";

export type BookingStatus =
    | "PENDING"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export type PaymentStatus =
    | "UNPAID"
    | "PAID"
    | "FAILED"
    | "REFUND_INITIATED"
    | "REFUNDED";

export interface BookingListItem {
    bookingId: string;
    customer: {
        name: string;
        mobile: string;
    };
    userId?: {
        name: string;
        mobile: string;
    };
    date: string;
    slot: Slot;
    status: BookingStatus;
    payment: { status: PaymentStatus };
    totalAmount: number;
    isBulk: boolean;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface BookingListResponse {
    success: boolean;
    data: BookingListItem[];
    pagination: Pagination;
}

export interface BookingDetails {
    bookingId: string;
    customer: {
        name: string;
        mobile: string;
        address: string;
        mapLocation?: {
            lat: number;
            lng: number;
        };
    };
    vehicles: {
        number: string;
        type: string;
        serviceId: {
            name: string;
            price: number;
        };
        addons: {
            name: string;
            price: number;
        }[];
        price: number;
    }[];
    discount: number;
    totalAmount: number;
    status: BookingStatus;
    slot: string;
    date: string;
    technicianId?: {
        name: string;
        mobile: string;
    };
    payment: {
        method?: "CASH" | "UPI";
        status: PaymentStatus;
        transactionId?: string;
    };
}


export interface BookingDetailsResponse {
    success: boolean;
    data: BookingDetails;
}
