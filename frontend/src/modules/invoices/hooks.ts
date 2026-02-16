import { useQuery } from "@tanstack/react-query";
import { getInvoiceApi } from "./api";

export const useInvoice = (bookingId?: string) =>
    useQuery({
        queryKey: ["invoice", bookingId],
        queryFn: () => getInvoiceApi(bookingId!),
        enabled: !!bookingId,
    });
