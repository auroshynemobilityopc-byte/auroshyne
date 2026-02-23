import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/shared/Badge";
import { Card } from "../../../components/shared/Card";

import type { BookingListItem } from "../types";

interface Props {
    booking: BookingListItem;
    onClick: () => void;
}

export const BookingCard: React.FC<Props> = ({ booking }) => {
    const navigate = useNavigate();
    return (
        <Card clickable onClick={() => navigate(`/admin/bookings/${booking.bookingId}`)}
            className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-medium">{booking.userId?.name || booking.customer.name}</p>
                    <p className="text-xs text-zinc-400">{booking.userId?.mobile || booking.customer.mobile}</p>
                </div>
                <Badge>{booking.status}</Badge>
            </div>

            <p className="text-sm text-zinc-400">
                {booking.date} • {booking.slot}
            </p>

            <div className="flex justify-between items-center">
                <Badge variant={booking.payment.status === "PAID" ? "success" : "warning"}>
                    {booking.payment.status}
                </Badge>
                <p className="font-semibold">₹ {booking.totalAmount}</p>
            </div>
        </Card>
    );
};
