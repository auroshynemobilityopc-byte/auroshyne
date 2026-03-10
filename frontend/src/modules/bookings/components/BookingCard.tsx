import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/shared/Badge";
import { Card } from "../../../components/shared/Card";
import { CarFront, Bike, Layers } from "lucide-react";

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
                <div className="flex gap-3 items-center">
                    <div
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 border border-white/5"
                        title={booking.isBulk ? "Bulk Booking" : booking.vehicles?.[0]?.type === '2W' ? "Bike" : "Car"}
                    >
                        {booking.isBulk ? (
                            <Layers className="w-4 h-4 text-indigo-400" />
                        ) : booking.vehicles?.[0]?.type === '2W' ? (
                            <Bike className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <CarFront className="w-4 h-4 text-amber-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-zinc-100">{booking.userId?.name || booking.customer.name}</p>
                        <p className="text-xs text-zinc-500">{booking.userId?.mobile || booking.customer.mobile}</p>
                    </div>
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
