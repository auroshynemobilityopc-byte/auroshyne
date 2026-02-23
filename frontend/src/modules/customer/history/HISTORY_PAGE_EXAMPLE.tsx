/**
 * Example: Updated History Page with Offline Support
 * 
 * This shows how to refactor HistoryPage to include:
 * 1. Offline-first data loading
 * 2. Offline alert display
 * 3. Disabled buttons when offline
 * 4. Last sync timestamp
 */

import { Clock, MapPin, UserCheck, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { useMyBookingsOffline, useServicesOffline, useAddonsOffline, useCancelBookingOffline } from "../booking/hooksOffline";
import { useState, useMemo } from "react";
import { HistoryDetailsSheet } from "./components/HistoryDetailsSheet";
import { OfflineAlert, OfflineButton } from "../shared/components/OfflineButton";
import { useOffline } from "../../../lib/OfflineContext";

export default function HistoryPageWithOffline() {
    // Use offline-first hooks instead of regular hooks
    const { data: result, isLoading, isError } = useMyBookingsOffline();
    const { data: servicesResult } = useServicesOffline();
    const { data: addonsResult } = useAddonsOffline();
    const { isOffline, lastSyncedAt } = useOffline();
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBookingOffline();

    const [activeTab, setActiveTab] = useState("PENDING");
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const bookings = result?.data || [];
    const SERVICES = servicesResult?.data || [];
    const ADDONS = addonsResult?.data || [];

    const filteredBookings = useMemo(() => {
        return bookings.filter((b: any) => {
            if (activeTab === "PENDING") {
                return ["PENDING", "ASSIGNED", "IN_PROGRESS"].includes(b.status);
            }
            return ["COMPLETED", "CANCELLED"].includes(b.status);
        });
    }, [bookings, activeTab]);

    const formatSyncTime = (timestamp: number | null) => {
        if (!timestamp) return "Never synced";
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (isLoading) {
        return <div className="p-6 pb-24 text-center mt-12">Loading history...</div>;
    }

    if (isError) {
        return (
            <div className="p-6 pb-24 text-center mt-12 text-red-500 flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>Failed to load history. {!isOffline && "Please try again later."}</span>
            </div>
        );
    }

    return (
        <div className="p-6 pb-24 md:max-w-7xl md:mx-auto w-full">
            {/* Show offline alert when offline */}
            <OfflineAlert />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Booking History</h1>
                {lastSyncedAt && (
                    <div className="text-xs text-zinc-400 group relative">
                        Last synced: {formatSyncTime(lastSyncedAt)}
                        <div className="absolute bottom-full right-0 hidden group-hover:block bg-zinc-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap mb-2">
                            {new Date(lastSyncedAt).toLocaleString()}
                        </div>
                    </div>
                )}
            </div>

            {/* Tab buttons */}
            <div className="mb-6 overflow-hidden rounded-lg bg-charcoal-800 p-1 flex">
                <button
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                        activeTab === "PENDING"
                            ? "bg-brand-blue text-white"
                            : "text-text-grey hover:text-white"
                    )}
                    onClick={() => setActiveTab("PENDING")}
                >
                    Active / Progress
                </button>
                <button
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                        activeTab === "COMPLETED"
                            ? "bg-brand-blue text-white"
                            : "text-text-grey hover:text-white"
                    )}
                    onClick={() => setActiveTab("COMPLETED")}
                >
                    Completed / Cancelled
                </button>
            </div>

            {/* Empty state */}
            {filteredBookings.length === 0 ? (
                <div className="text-center text-text-grey mt-12">
                    No bookings found in this status.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBookings.map((booking: any) => {
                        const service = SERVICES.find(
                            (s: any) => s._id === booking.vehicles?.[0]?.serviceId
                        )?.name || "Wash Service";
                        const isCompleted = booking.status === 'COMPLETED';
                        const isCancelled = booking.status === 'CANCELLED';
                        const isPending = ["PENDING", "ASSIGNED", "IN_PROGRESS"].includes(booking.status);

                        return (
                            <div
                                key={booking._id}
                                className="bg-charcoal-800 rounded-2xl p-5 border border-white/5 flex flex-col h-full hover:border-brand-blue/50 transition-colors"
                            >
                                {/* Booking header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-text-grey mb-1 block">
                                            #{booking.bookingId}
                                        </span>
                                        <h3 className="font-bold text-lg leading-tight">
                                            {service} {booking.vehicles?.length > 1 && `(+${booking.vehicles.length - 1})`}
                                        </h3>
                                    </div>
                                    <span
                                        className={cn(
                                            "px-2 py-1 rounded bg-brand-blue/20 text-xs font-bold uppercase tracking-wider shrink-0",
                                            isCompleted
                                                ? "bg-green-500/20 text-green-400"
                                                : isCancelled
                                                    ? "bg-red-500/20 text-red-400"
                                                    : "bg-brand-blue/20 text-brand-blue"
                                        )}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Booking details */}
                                <div className="space-y-2 mb-4 text-sm text-text-grey flex-1">
                                    {booking.date && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{format(new Date(booking.date), "MMM dd, yyyy - hh:mm a")}</span>
                                        </div>
                                    )}
                                    {booking.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{booking.address.street}, {booking.address.house}</span>
                                        </div>
                                    )}
                                    {booking.technicianId && (
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4" />
                                            <span>Assigned Technician</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => setSelectedBooking(booking)}
                                        className="flex-1 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs font-medium transition-colors"
                                    >
                                        View Details
                                    </button>

                                    {/* Cancel/Refund button - disabled when offline */}
                                    {isPending && !isCancelled && (
                                        <OfflineButton
                                            onClick={() => cancelBooking({ bookingId: booking._id })}
                                            disabled={isCancelling}
                                            className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs font-medium transition-colors"
                                        >
                                            Cancel
                                        </OfflineButton>
                                    )}

                                    {isCompleted && !booking.refundRequested && (
                                        <OfflineButton
                                            className="flex-1 px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded text-xs font-medium transition-colors"
                                        >
                                            Request Refund
                                        </OfflineButton>
                                    )}
                                </div>

                                {/* Offline indicator */}
                                {isOffline && (
                                    <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-amber-400/70">
                                        📱 Showing cached data from {formatSyncTime(lastSyncedAt)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Details sheet */}
            {selectedBooking && (
                <HistoryDetailsSheet
                    open={true}
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    services={SERVICES}
                    addons={ADDONS}
                />
            )}
        </div>
    );
}

/**
 * MIGRATION GUIDE: How to update your existing HistoryPage
 * 
 * Changes needed in src/modules/customer/history/pages/HistoryPage.tsx:
 * 
 * 1. Update imports:
 *    OLD: import { useMyBookings, useServices, useAddons } from "../../booking/hooks";
 *    NEW: import { useMyBookingsOffline, useServicesOffline, useAddonsOffline } from "../../booking/hooksOffline";
 *         import { OfflineAlert, OfflineButton } from "../../shared/components/OfflineButton";
 *         import { useOffline } from "../../../../lib/OfflineContext";
 * 
 * 2. Update hooks:
 *    OLD: const { data: result, isLoading } = useMyBookings();
 *    NEW: const { data: result, isLoading } = useMyBookingsOffline();
 *         const { isOffline, lastSyncedAt } = useOffline();
 * 
 * 3. Add offline alert near top of return:
 *    <OfflineAlert />
 * 
 * 4. Replace action buttons with OfflineButton:
 *    OLD: <button onClick={...}>Cancel</button>
 *    NEW: <OfflineButton onClick={...}>Cancel</OfflineButton>
 * 
 * 5. Update button mutations:
 *    OLD: import { useCancelBooking } from "../../booking/hooks";
 *    NEW: import { useCancelBookingOffline } from "../../booking/hooksOffline";
 *         const { mutate: cancelBooking } = useCancelBookingOffline();
 */
