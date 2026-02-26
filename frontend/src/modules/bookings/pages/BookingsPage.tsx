import { useState, useEffect } from "react";
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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";

export const BookingsPage = () => {
    const [page, setPage] = useState(1);
    const [slot, setSlot] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [assignFilter, setAssignFilter] = useState("ALL");
    const [paymentFilter, setPaymentFilter] = useState("ALL");

    /* ✅ DATE STATE */
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const [addOpen, setAddOpen] = useState(false);

    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const [assignOpen, setAssignOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [upiOpen, setUpiOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [paymentStatus, setPaymentStatus] =
        useState<PaymentStatus>("UNPAID");

    const slots = ["ALL", "MORNING", "AFTERNOON", "EVENING"];

    /* ✅ RESET PAGE WHEN FILTER CHANGES */
    useEffect(() => {
        setPage(1);
    }, [slot, statusFilter, assignFilter, paymentFilter, selectedDate]);

    /* ---------------- FILTER OBJECT ---------------- */
    const filters = {
        slot: slot === "ALL" ? undefined : slot,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        isAssigned:
            assignFilter === "ALL"
                ? undefined
                : assignFilter === "ASSIGNED"
                    ? "true"
                    : "false",
        paymentStatus:
            paymentFilter === "ALL" ? undefined : paymentFilter,

        /* ✅ SEND DATE IN YYYY-MM-DD FORMAT */
        date: selectedDate
            ? selectedDate.toISOString().split("T")[0]
            : undefined,
    };

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

    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: refetchInfinite,
    } = useBookingsInfinite(filters);

    const mobileBookings: BookingListItem[] =
        infiniteData?.pages.flatMap((p) => p.data) ?? [];

    const { data, refetch, isFetching } = useBookings({
        page,
        limit: 10,
        ...filters,
    });

    const desktopBookings: BookingListItem[] = data?.data ?? [];

    const refetchAll = () => {
        refetch();
        refetchInfinite();
    };

    const assignMutation = useAssignTechnician(refetchAll);
    const paymentMutation = useUpdatePayment(refetchAll);
    const statusMutation = useUpdateStatus(refetchAll);

    /* ---------------- MUTATIONS ---------------- */

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

            {/* 🔷 TOOLBAR */}
            <div className="flex flex-col gap-3">

                {/* TOP ROW: DATE + TOGGLE */}
                <div className="flex items-center gap-2">

                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: any) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        portalId="root"
                        popperClassName="z-[9999]"
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 h-9"
                    />

                    {/* TOGGLE BUTTON (mobile only) */}
                    <Button
                        variant="secondary"
                        className="lg:hidden h-9 px-3 text-xs"
                        onClick={() => setShowFilters((p) => !p)}
                    >
                        {showFilters ? "Hide Filters" : "Filters"}
                    </Button>
                </div>

                {/* TABS FULL WIDTH */}
                <div className="w-full [&>*]:w-full [&>*]:flex [&>*]:gap-1 [&>*_button]:flex-1 [&>*_button]:text-center [&>*_button]:!h-9 [&>*_button]:!text-xs">
                    <Tabs
                        tabs={slots.map((s) => ({ label: s, value: s }))}
                        value={slot}
                        onChange={(v) => setSlot(v)}
                    />
                </div>

                {/* FILTERS + ADD */}
                <div
                    className={clsx(
                        "flex flex-wrap items-center gap-2 justify-start md:justify-end",
                        "lg:flex", // always visible on desktop
                        showFilters ? "flex" : "hidden lg:flex" // toggle on mobile
                    )}
                >
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 h-9"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <select
                        value={assignFilter}
                        onChange={(e) => setAssignFilter(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 h-9"
                    >
                        <option value="ALL">All Assign</option>
                        <option value="UNASSIGNED">Unassigned</option>
                        <option value="ASSIGNED">Assigned</option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
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
                        className="w-full sm:w-auto"
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

                <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">

                        <Button
                            variant="secondary"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3"
                        >
                            Prev
                        </Button>

                        <span className="text-sm text-zinc-400 min-w-[90px] text-center">
                            Page {data?.pagination?.page || 1} / {data?.pagination?.pages || 1}
                        </span>

                        <Button
                            variant="secondary"
                            disabled={page === data?.pagination?.pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3"
                        >
                            Next
                        </Button>

                    </div>
                </div>
            </div>

            {/* 🔄 REFRESH */}
            <Button variant="ghost" onClick={refetchAll} loading={isFetching}>
                Refresh
            </Button>

            {/* DRAWERS */}
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