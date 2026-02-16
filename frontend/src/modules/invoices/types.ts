export interface InvoiceVehicle {
    number: string;
    type: string;
    model: string;
    service: {
        name: string;
        price: number;
    };
    addons: {
        name: string;
        price: number;
    }[];
    price: number;
}

export interface InvoiceData {
    invoiceNumber: string;
    bookingId: string;
    date: string;
    slot: string;
    customer: {
        name: string;
        mobile: string;
        address: string;
        apartmentName?: string;
    };
    vehicles: InvoiceVehicle[];
    subtotal: number;
    discount: number;
    totalAmount: number;
    payment: {
        method?: "CASH" | "UPI";
        status: string;
        transactionId?: string;
    };
    status: string;
    generatedAt: string;
    downloadUrl: string;
}
