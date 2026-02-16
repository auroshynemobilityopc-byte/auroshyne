import { Card } from "../../../components/shared/Card";

export const InvoiceSummary = ({ invoice }: any) => (
    <Card className="flex flex-col gap-2">
        <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {invoice.subtotal}</span>
        </div>

        <div className="flex justify-between text-zinc-400">
            <span>Discount</span>
            <span>- ₹ {invoice.discount}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹ {invoice.totalAmount}</span>
        </div>

        <div className="text-sm text-zinc-400">
            Payment: {invoice.payment.status}{" "}
            {invoice.payment.method &&
                `(${invoice.payment.method})`}
        </div>
    </Card>
);
