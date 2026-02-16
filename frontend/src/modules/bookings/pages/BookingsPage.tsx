import { useState } from "react";
import {
    useAssignTechnician,
    useBookings,
    useBookingsInfinite,
    useUpdatePayment,
    useUpdateStatus,
} from "../hooks";
import type {
    BookingListItem,
    BookingStatus,
    PaymentStatus,
} from "../types";

import { BookingCard } from "../components/BookingCard";
import { BookingTable } from "../components/BookingTable";
import { Button } from "../../../components/shared/Button";
import { Tabs } from "../../../components/shared/Tabs";
import { SwipeRow } from "../../../components/mobile/SwipeRow";
import { AssignTechnicianSheet } from "../components/AssignTechnicianSheet";
import { PaymentActions } from "../components/PaymentActions";
import { StatusActions } from "../components/StatusActions";
import { UpiTxnDrawer } from "../components/UpiTxnDrawer";

export const BookingsPage = () => {
    const [page, setPage] = useState(1);
    const [slot, setSlot] = useState("ALL");

    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const [assignOpen, setAssignOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [upiOpen, setUpiOpen] = useState(false);

    const [paymentStatus, setPaymentStatus] =
        useState<PaymentStatus>("UNPAID");

    const assignMutation = useAssignTechnician();
    const paymentMutation = useUpdatePayment();
    const statusMutation = useUpdateStatus();

    const slots = ["ALL", "MORNING", "AFTERNOON", "EVENING"];

    /* ---------------- ACTION OPENERS ---------------- */

    const openAssign = (id: string) => {
        setSelectedBookingId(id);
        setAssignOpen(true);
    };

    const openStatus = (id: string) => {
        setSelectedBookingId(id);
        setStatusOpen(true);
    };

    const openPayment = (id: string, status: PaymentStatus) => {
        setSelectedBookingId(id);
        setPaymentStatus(status);
        setPaymentOpen(true);
    };

    /* ---------------- DATA QUERIES ---------------- */

    /** 📱 MOBILE → infinite */
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useBookingsInfinite({
        slot: slot === "ALL" ? undefined : slot,
    });

    const mobileBookings: BookingListItem[] =
        infiniteData?.pages.flatMap((p) => p.data) ?? [];

    /** 🖥 DESKTOP → paginated */
    const { data, refetch, isFetching } = useBookings({
        page,
        limit: 10,
        slot: slot === "ALL" ? undefined : slot,
    });

    const desktopBookings: BookingListItem[] = data?.data ?? [];

    /* ---------------- MUTATION HANDLERS ---------------- */

    const handleAssign = (technicianId: string) => {
        if (!selectedBookingId) return;

        assignMutation.mutate(
            { bookingId: selectedBookingId, technicianId },
            {
                onSuccess: () => {
                    setAssignOpen(false);
                    setSelectedBookingId(null);
                },
            }
        );
    };

    const handleStatusChange = (status: BookingStatus) => {
        if (!selectedBookingId) return;

        statusMutation.mutate(
            { bookingId: selectedBookingId, status },
            {
                onSuccess: () => {
                    setStatusOpen(false);
                    setSelectedBookingId(null);
                },
            }
        );
    };

    const handlePaymentAction = (
        status: PaymentStatus,
        method?: "CASH" | "UPI"
    ) => {
        if (!selectedBookingId) return;

        /** UPI → ask txn id */
        if (status === "PAID" && method === "UPI") {
            setPaymentOpen(false);
            setUpiOpen(true);
            return;
        }

        paymentMutation.mutate(
            {
                bookingId: selectedBookingId,
                method: method ?? "CASH",
                status,
            },
            {
                onSuccess: () => {
                    setPaymentOpen(false);
                    setSelectedBookingId(null);
                },
            }
        );
    };

    const handleUpiSubmit = (transactionId: string) => {
        if (!selectedBookingId) return;

        paymentMutation.mutate(
            {
                bookingId: selectedBookingId,
                method: "UPI",
                status: "PAID",
                transactionId,
            },
            {
                onSuccess: () => {
                    setUpiOpen(false);
                    setSelectedBookingId(null);
                },
            }
        );
    };

    /* ---------------- RENDER ---------------- */

    return (
        <div className="flex flex-col gap-4">
            {/* 🔹 SLOT TABS */}
            <Tabs
                tabs={slots.map((s) => ({ label: s, value: s }))}
                value={slot}
                onChange={(v) => setSlot(v)}
            />

            {/* 📱 MOBILE LIST */}
            <div className="flex flex-col gap-3 lg:hidden">
                {mobileBookings.map((b) => (
                    <SwipeRow
                        key={b.bookingId}
                        onSwipeLeft={() => openAssign(b.bookingId)}
                        onSwipeRight={() =>
                            openPayment(b.bookingId, b.payment.status)
                        }
                    >
                        <BookingCard
                            booking={b}
                            onClick={() => openStatus(b.bookingId)}
                        />
                    </SwipeRow>
                ))}

                {hasNextPage && (
                    <Button
                        onClick={() => fetchNextPage()}
                        loading={isFetchingNextPage}
                    >
                        Load More
                    </Button>
                )}
            </div>

            {/* 🖥 DESKTOP TABLE */}
            <div className="hidden lg:block">
                <BookingTable
                    data={desktopBookings}
                    onAssign={openAssign}
                    onPayment={(id, status) => openPayment(id, status)}
                    onStatus={openStatus}
                />

                <div className="flex justify-between items-center mt-4">
                    <Button
                        variant="secondary"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Prev
                    </Button>

                    <Button
                        variant="secondary"
                        disabled={page === data?.pagination.pages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* 🔄 REFRESH */}
            <Button
                variant="ghost"
                onClick={() => refetch()}
                loading={isFetching}
            >
                Refresh
            </Button>

            {/* ---------------- DRAWERS & SHEETS ---------------- */}

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
