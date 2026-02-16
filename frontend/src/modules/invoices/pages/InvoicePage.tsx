import { useParams } from "react-router-dom";
import { useInvoice } from "../hooks";
import { downloadInvoicePdfApi } from "../api";
import { InvoiceHeader } from "../components/InvoiceHeader";
import { InvoiceVehicleTable } from "../components/InvoiceVehicleTable";
import { InvoiceSummary } from "../components/InvoiceSummary";
import { Button } from "../../../components/shared/Button";
import { FileDown, RefreshCw } from "lucide-react";

export const InvoicePage = () => {
    const { bookingId } = useParams();

    const { data: invoice, isLoading, refetch } =
        useInvoice(bookingId);

    if (isLoading || !invoice) {
        return (
            <div className="p-3 lg:p-6">
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-pulse">
                    <div className="h-4 w-32 bg-zinc-800 rounded mb-4" />
                    <div className="h-3 w-48 bg-zinc-800 rounded mb-2" />
                    <div className="h-3 w-40 bg-zinc-800 rounded" />
                </div>
            </div>
        );
    }

    const handleDownload = () => {
        downloadInvoicePdfApi(invoice.downloadUrl);
    };

    return (
        <div className="flex flex-col gap-4">

            {/* HEADER CARD */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm shadow-black/20">
                <InvoiceHeader invoice={invoice} />
            </div>

            {/* VEHICLE TABLE CARD */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm shadow-black/20">
                <InvoiceVehicleTable vehicles={invoice.vehicles} />
            </div>

            {/* SUMMARY CARD (TOTAL HIGHLIGHT) */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm shadow-black/20">
                <InvoiceSummary invoice={invoice} />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2 mt-2">

                <Button
                    onClick={handleDownload}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                >
                    <FileDown className="w-4 h-4" />
                    Download Invoice PDF
                </Button>

                <Button
                    variant="ghost"
                    onClick={() => refetch()}
                    className="w-full h-11 rounded-xl text-zinc-400 hover:text-white active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>
        </div>
    );
};
