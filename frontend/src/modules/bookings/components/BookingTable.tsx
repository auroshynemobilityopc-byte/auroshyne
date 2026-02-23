import { useNavigate } from "react-router-dom";
import type {
    BookingListItem,
    PaymentStatus,
    BookingStatus,
} from "../types";
import {
    UserPlus,
    Play,
    Check,
    CreditCard,
} from "lucide-react";

interface Props {
    data: BookingListItem[];
    onAssign: (id: string) => void;
    onPayment: (id: string, status: PaymentStatus) => void;
    onStatus: (id: string) => void;
}

export const BookingTable: React.FC<Props> = ({
    data,
    onAssign,
    onPayment,
    onStatus,
}) => {
    const navigate = useNavigate();

    const canAssign = (status: BookingStatus) => status === "PENDING";
    const canStart = (status: BookingStatus) => status === "ASSIGNED";
    const canComplete = (status: BookingStatus) =>
        status === "IN_PROGRESS";

    const statusBadge = (status: BookingStatus) => {
        const base = "px-2 py-1 text-xs rounded-full font-medium";

        switch (status) {
            case "PENDING":
                return `${base} bg-amber-500/15 text-amber-400`;
            case "ASSIGNED":
                return `${base} bg-sky-500/15 text-sky-400`;
            case "IN_PROGRESS":
                return `${base} bg-indigo-500/15 text-indigo-400`;
            case "COMPLETED":
                return `${base} bg-emerald-500/15 text-emerald-400`;
            case "CANCELLED":
                return `${base} bg-red-500/15 text-red-400`;
            default:
                return base;
        }
    };

    const paymentBadge = (status: PaymentStatus) => {
        const base = "px-2 py-1 text-xs rounded-full font-medium";

        switch (status) {
            case "PAID":
                return `${base} bg-emerald-500/15 text-emerald-400`;
            case "UNPAID":
                return `${base} bg-amber-500/15 text-amber-400`;
            case "FAILED":
                return `${base} bg-red-500/15 text-red-400`;
            case "REFUND_INITIATED":
                return `${base} bg-purple-500/15 text-purple-400`;
            case "REFUNDED":
                return `${base} bg-zinc-500/15 text-zinc-400`;
            default:
                return base;
        }
    };

    return (
        <div className="hidden lg:block">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm shadow-black/20 overflow-x-auto">
                <table className="w-full text-sm">

                    {/* HEADER */}
                    <thead className="text-zinc-400 sticky top-0 bg-zinc-900 z-10">
                        <tr className="border-b border-zinc-800">
                            <th className="text-left p-3 font-medium">Customer</th>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">Slot</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Payment</th>
                            <th className="text-left p-3 font-medium">Amount</th>
                            <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {data.map((b) => (
                            <tr
                                key={b.bookingId}
                                onClick={() =>
                                    navigate(`/admin/bookings/${b.bookingId}`)
                                }
                                className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer transition-all duration-150"
                            >
                                <td className="p-3">
                                    <div className="font-medium text-zinc-100">
                                        {b.userId?.name || b.customer.name}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        {b.userId?.mobile || b.customer.mobile}
                                    </div>
                                </td>

                                <td className="p-3 text-zinc-400">
                                    {b.date}
                                </td>

                                <td className="p-3 text-zinc-400">
                                    {b.slot}
                                </td>

                                {/* STATUS BADGE */}
                                <td className="p-3">
                                    <span className={statusBadge(b.status)}>
                                        {b.status}
                                    </span>
                                </td>

                                {/* PAYMENT BADGE */}
                                <td className="p-3">
                                    <span className={paymentBadge(b.payment.status)}>
                                        {b.payment.status}
                                    </span>
                                </td>

                                {/* AMOUNT */}
                                <td className="p-3 font-semibold text-zinc-100">
                                    ₹ {b.totalAmount}
                                </td>

                                {/* ACTIONS */}
                                <td
                                    className="p-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-end gap-2 flex-wrap">

                                        {/* ASSIGN */}
                                        {canAssign(b.status) && (
                                            <button
                                                onClick={() => onAssign(b.bookingId)}
                                                className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                            >
                                                <UserPlus className="w-4 h-4 text-sky-400" />
                                            </button>
                                        )}

                                        {/* START */}
                                        {canStart(b.status) && (
                                            <button
                                                onClick={() => onStatus(b.bookingId)}
                                                className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                            >
                                                <Play className="w-4 h-4 text-amber-400" />
                                            </button>
                                        )}

                                        {/* COMPLETE */}
                                        {canComplete(b.status) && (
                                            <button
                                                onClick={() => onStatus(b.bookingId)}
                                                className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                            >
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            </button>
                                        )}

                                        {/* PAYMENT */}
                                        {b.payment.status !== "REFUNDED" && (
                                            <button
                                                onClick={() =>
                                                    onPayment(b.bookingId, b.payment.status)
                                                }
                                                className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                            >
                                                <CreditCard className="w-4 h-4 text-purple-400" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
