import { api } from "../../lib/apiClient/axios";
import type { InvoiceData } from "./types";

export const getInvoiceApi = async (bookingId: string) => {
    const res = await api.get(`/invoices/generate/${bookingId}`);
    return res.data.data as InvoiceData;
};

export const downloadInvoicePdfApi = async (downloadUrl: string) => {
    window.open(downloadUrl, "_blank");
};
