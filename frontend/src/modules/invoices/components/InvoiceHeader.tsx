import { Card } from "../../../components/shared/Card";

export const InvoiceHeader = ({ invoice }: any) => (
    <Card className="flex flex-col gap-2">
        <div className="flex justify-between">
            <p className="font-semibold">{invoice.invoiceNumber}</p>
            <p className="text-sm text-zinc-400">
                {invoice.date} • {invoice.slot}
            </p>
        </div>

        <div className="text-sm">
            <p>{invoice.customer.name}</p>
            <p className="text-zinc-400">{invoice.customer.mobile}</p>
            <p className="text-zinc-500">
                {invoice.customer.address}{" "}
                {invoice.customer.apartmentName &&
                    `• ${invoice.customer.apartmentName}`}
            </p>
        </div>
    </Card>
);
