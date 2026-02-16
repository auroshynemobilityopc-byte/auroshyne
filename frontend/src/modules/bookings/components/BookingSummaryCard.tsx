import { Card } from "../../../components/shared/Card";

export const BookingSummaryCard = ({ booking }: any) => {
    return (
        <Card className="flex flex-col gap-2">
            <p className="text-sm text-zinc-400">
                {booking.date} • {booking.slot}
            </p>

            <p>Status: {booking.status}</p>

            <p>
                Payment: {booking.payment.status}{" "}
                {booking.payment.method && `(${booking.payment.method})`}
            </p>

            {booking.technicianId && (
                <p className="text-sm">
                    Tech: {booking.technicianId.name} •{" "}
                    {booking.technicianId.mobile}
                </p>
            )}

            <p>Discount: ₹ {booking.discount}</p>

            <p className="text-lg font-semibold">
                Total: ₹ {booking.totalAmount}
            </p>
        </Card>
    );
};
