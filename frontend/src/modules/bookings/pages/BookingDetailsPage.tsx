import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useBookingDetails } from "../hooks";
import {
    useAssignTechnician,
    useUpdatePayment,
    useUpdateStatus,
} from "../hooks";

import type {
    PaymentStatus,
    BookingStatus,
} from "../types";

import { VehicleItem } from "../components/VehicleItem";
import { BookingSummaryCard } from "../components/BookingSummaryCard";

import { AssignTechnicianSheet } from "../components/AssignTechnicianSheet";
import { PaymentActions } from "../components/PaymentActions";
import { StatusActions } from "../components/StatusActions";
import { UpiTxnDrawer } from "../components/UpiTxnDrawer";

import { Button } from "../../../components/shared/Button";

export const BookingDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: booking, isLoading, refetch } =
        useBookingDetails(id);

    /* ---------------- DRAWER STATE ---------------- */
    const [assignOpen, setAssignOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [upiOpen, setUpiOpen] = useState(false);

    const [paymentStatus, setPaymentStatus] =
        useState<PaymentStatus>("UNPAID");

    /* ---------------- MUTATIONS ---------------- */
    const assignMutation = useAssignTechnician();
    const paymentMutation = useUpdatePayment();
    const statusMutation = useUpdateStatus();

    /* ---------------- HANDLERS ---------------- */

    const handleAssign = (technicianId: string) => {
        if (!booking) return;

        assignMutation.mutate(
            { bookingId: booking.bookingId, technicianId },
            {
                onSuccess: () => {
                    setAssignOpen(false);
                    refetch();
                },
            }
        );
    };

    const handleStatusChange = (status: BookingStatus) => {
        if (!booking) return;

        statusMutation.mutate(
            { bookingId: booking.bookingId, status },
            {
                onSuccess: () => {
                    setStatusOpen(false);
                    refetch();
                },
            }
        );
    };

    const handlePaymentAction = (
        status: PaymentStatus,
        method?: "CASH" | "UPI"
    ) => {
        if (!booking) return;

        if (status === "PAID" && method === "UPI") {
            setPaymentOpen(false);
            setUpiOpen(true);
            return;
        }

        paymentMutation.mutate(
            {
                bookingId: booking.bookingId,
                method: method ?? "CASH",
                status,
            },
            {
                onSuccess: () => {
                    setPaymentOpen(false);
                    refetch();
                },
            }
        );
    };

    const handleUpiSubmit = (transactionId: string) => {
        if (!booking) return;

        paymentMutation.mutate(
            {
                bookingId: booking.bookingId,
                method: "UPI",
                status: "PAID",
                transactionId,
            },
            {
                onSuccess: () => {
                    setUpiOpen(false);
                    refetch();
                },
            }
        );
    };

    /* ---------------- LOADING ---------------- */
    if (isLoading || !booking) {
        return <p>Loading...</p>;
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="flex flex-col gap-4">
            {/* CUSTOMER */}
            <div className="bg-zinc-900 rounded-xl p-4">
                <p className="font-medium">{booking.customer.name}</p>
                <p className="text-sm text-zinc-400">
                    {booking.customer.mobile}
                </p>
                <p className="text-sm text-zinc-500">
                    {booking.customer.address}
                </p>
            </div>

            {/* SUMMARY */}
            <BookingSummaryCard booking={booking} />

            {/* VEHICLES */}
            <div className="flex flex-col gap-3">
                {booking.vehicles.map((v: any) => (
                    <VehicleItem key={v.number} v={v} />
                ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant="secondary"
                    onClick={() => setAssignOpen(true)}
                >
                    Assign Technician
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => setStatusOpen(true)}
                >
                    Change Status
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => {
                        setPaymentStatus(booking.payment.status);
                        setPaymentOpen(true);
                    }}
                >
                    Payment
                </Button>
            </div>

            {/* INVOICE */}
            <Button
                onClick={() =>
                    navigate(`/admin/invoices/${booking.bookingId}`)
                }
            >
                View Invoice
            </Button>

            {/* REFRESH */}
            <Button variant="ghost" onClick={() => refetch()}>
                Refresh
            </Button>

            {/* ---------------- DRAWERS ---------------- */}

            <AssignTechnicianSheet
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
                onAssign={handleAssign}
            />

            <PaymentActions
                open={paymentOpen}
                status={paymentStatus}
                onClose={() => setPaymentOpen(false)}
                onSelect={handlePaymentAction}
            />

            <UpiTxnDrawer
                open={upiOpen}
                onClose={() => setUpiOpen(false)}
                onSubmit={handleUpiSubmit}
            />

            <StatusActions
                open={statusOpen}
                onClose={() => setStatusOpen(false)}
                onSelect={handleStatusChange}
            />
        </div>
    );
};
