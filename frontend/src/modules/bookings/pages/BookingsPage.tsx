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
import { AddBookingSheet } from "../components/AddBookingSheet";

export const BookingsPage = () => {
    const [page, setPage] = useState(1);
    const [slot, setSlot] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [assignFilter, setAssignFilter] = useState("ALL");
    const [paymentFilter, setPaymentFilter] = useState("ALL");

    const [addOpen, setAddOpen] = useState(false);

    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const [assignOpen, setAssignOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [upiOpen, setUpiOpen] = useState(false);

    const [paymentStatus, setPaymentStatus] =
        useState<PaymentStatus>("UNPAID");


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
        refetch: refetchInfinite,
    } = useBookingsInfinite({
        slot: slot === "ALL" ? undefined : slot,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        isAssigned: assignFilter === "ALL" ? undefined : assignFilter === "ASSIGNED" ? "true" : "false",
        paymentStatus: paymentFilter === "ALL" ? undefined : paymentFilter,
    });

    const mobileBookings: BookingListItem[] =
        infiniteData?.pages.flatMap((p) => p.data) ?? [];

    /** 🖥 DESKTOP → paginated */
    const { data, refetch, isFetching } = useBookings({
        page,
        limit: 10,
        slot: slot === "ALL" ? undefined : slot,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        isAssigned: assignFilter === "ALL" ? undefined : assignFilter === "ASSIGNED" ? "true" : "false",
        paymentStatus: paymentFilter === "ALL" ? undefined : paymentFilter,
    });

    const refetchAll = () => {
        refetch();
        refetchInfinite();
    };

    const assignMutation = useAssignTechnician(refetchAll);
    const paymentMutation = useUpdatePayment(refetchAll);
    const statusMutation = useUpdateStatus(refetchAll);

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
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center w-full">
                <div className="flex-1 w-full max-w-full overflow-hidden">
                    {/* 🔹 SLOT TABS */}
                    <Tabs
                        tabs={slots.map((s) => ({ label: s, value: s }))}
                        value={slot}
                        onChange={(v) => setSlot(v)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 h-9"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    {/* Assign Filter */}
                    <select
                        value={assignFilter}
                        onChange={(e) => { setAssignFilter(e.target.value); setPage(1); }}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 h-9"
                    >
                        <option value="ALL">All (Assign)</option>
                        <option value="UNASSIGNED">Unassigned</option>
                        <option value="ASSIGNED">Assigned</option>
                    </select>

                    {/* Payment Filter */}
                    <select
                        value={paymentFilter}
                        onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 h-9"
                    >
                        <option value="ALL">All Payment</option>
                        <option value="UNPAID">Unpaid</option>
                        <option value="PAID">Paid</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUND_INITIATED">Refund Init.</option>
                        <option value="REFUNDED">Refunded</option>
                    </select>

                    <Button
                        onClick={() => setAddOpen(true)}
                        fullWidth={false}
                    >
                        + Add Booking
                    </Button>
                </div>
            </div>

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
                        disabled={page === data?.pagination?.pages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* 🔄 REFRESH */}
            <Button
                variant="ghost"
                onClick={refetchAll}
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

            <AddBookingSheet
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={refetchAll}
            />
        </div>
    );
};
