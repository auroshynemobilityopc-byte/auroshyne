import { api } from "../../lib/apiClient/axios";
import type { InvoiceData } from "./types";

export const getInvoiceApi = async (bookingId: string) => {
    const res = await api.get(`/invoices/generate/${bookingId}`);
    return res.data.data as InvoiceData;
};

export const downloadInvoicePdfApi = async (downloadUrl: string) => {
    // For Cloudinary URLs, just open them in a new tab. 
    // The user can view/download the PDF using the browser's native PDF tools.
    window.open(downloadUrl, "_blank");
};
