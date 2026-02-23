import { useState } from "react";
import { Drawer } from "../../../../components/shared/Drawer";
import { Clock, MapPin, UserCheck, Phone, CheckCircle, X, Plus, Edit2, XCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { useCancelBooking, useRequestRefund } from "../../booking/hooks";
import { EditBookingSheet } from "./EditBookingSheet";

interface Props {
    booking: any;
    services: any[];
    addons: any[];
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

export const HistoryDetailsSheet = ({ booking, services, addons, open, onClose, onRefresh }: Props) => {
    const [editOpen, setEditOpen] = useState(false);
    const [refundReason, setRefundReason] = useState("");
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);

    const afterAction = () => {
        onRefresh?.();
        onClose();
    };

    const cancelMutation = useCancelBooking(afterAction);
    const refundMutation = useRequestRefund(afterAction);

    if (!booking) return null;

    const isCompleted = booking.status === "COMPLETED";
    const isCancelled = booking.status === "CANCELLED";
    const isPending = booking.status === "PENDING";
    const tech = booking.technicianId;
    const canEdit = isPending;
    const canCancel = isPending;
    const canRefund = isCancelled && booking.payment?.status === "PAID";

    const handleRefund = () => {
        refundMutation.mutate({ bookingId: booking.bookingId, reason: refundReason });
    };

    return (
        <>
            <Drawer open={open} onClose={onClose}>
                <div className="flex flex-col h-full max-h-[92vh]">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5 border-b border-zinc-800 pb-4">
                        <div className="flex-1">
                            <span className="text-xs font-mono text-text-grey mb-1 block">#{booking.bookingId}</span>
                            <h2 className="text-xl font-bold">Booking Details</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                                isCompleted ? "bg-green-500/20 text-green-400" :
                                    isCancelled ? "bg-red-500/20 text-red-400" :
                                        "bg-brand-blue/20 text-brand-blue"
                            )}>
                                {booking.status}
                            </span>
                            <button onClick={onClose} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto space-y-5 pb-36 pr-1">

                        {/* Action Buttons */}
                        {(canEdit || canCancel || canRefund) && (
                            <div className="flex gap-2 flex-wrap">
                                {canEdit && (
                                    <button
                                        onClick={() => setEditOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue/15 hover:bg-brand-blue/25 text-brand-blue border border-brand-blue/20 text-sm font-medium transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit Booking
                                    </button>
                                )}
                                {canCancel && (
                                    <button
                                        onClick={() => setConfirmCancel(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" /> Cancel
                                    </button>
                                )}
                                {canRefund && (
                                    <button
                                        onClick={() => setShowRefundForm(v => !v)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-sm font-medium transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Request Refund
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Cancel Confirmation */}
                        {confirmCancel && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertTriangle className="w-4 h-4" />
                                    <p className="text-sm font-semibold">Cancel this booking?</p>
                                </div>
                                <p className="text-xs text-zinc-400">This action cannot be undone.</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => cancelMutation.mutate({ bookingId: booking.bookingId })}
                                        disabled={cancelMutation.isPending}
                                        className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg py-2 transition-colors"
                                    >
                                        {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
                                    </button>
                                    <button
                                        onClick={() => setConfirmCancel(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg py-2 transition-colors"
                                    >
                                        Keep Booking
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Refund Form */}
                        {showRefundForm && (
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 space-y-3">
                                <p className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" /> Refund Request
                                </p>
                                <textarea
                                    value={refundReason}
                                    onChange={e => setRefundReason(e.target.value)}
                                    placeholder="Reason for refund..."
                                    rows={3}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-purple-500/50"
                                />
                                <button
                                    onClick={handleRefund}
                                    disabled={refundMutation.isPending || !refundReason.trim()}
                                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg py-2.5 transition-colors"
                                >
                                    {refundMutation.isPending ? "Submitting..." : "Submit Refund Request"}
                                </button>
                            </div>
                        )}

                        {/* Tech Info */}
                        {tech && (
                            <div className="bg-brand-blue/10 p-4 rounded-xl border border-brand-blue/20">
                                <h3 className="text-sm font-semibold text-brand-blue flex items-center gap-2 mb-3">
                                    <UserCheck className="w-4 h-4" /> Assigned Technician
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-lg">{tech.name}</p>
                                        <a href={`tel:${tech.mobile}`} className="text-sm text-text-grey hover:text-white flex items-center gap-1 mt-1">
                                            <Phone className="w-3 h-3" /> {tech.mobile}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Schedule & Location */}
                        <div className="bg-charcoal-800 p-4 rounded-xl border border-white/5 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-xs text-text-grey font-medium uppercase tracking-wider">Schedule</p>
                                    <p className="font-medium text-white">
                                        {booking.date ? format(new Date(booking.date), "dd MMM yyyy") : "-"} · {booking.slot}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-xs text-text-grey font-medium uppercase tracking-wider">Location</p>
                                    <p className="font-medium text-white text-sm">{booking.customer?.address}</p>
                                    {booking.customer?.apartmentName && (
                                        <p className="text-xs text-text-grey">{booking.customer.apartmentName}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Vehicles */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-grey mb-3 uppercase tracking-wider">Vehicles ({booking.vehicles?.length})</h3>
                            <div className="space-y-3">
                                {booking.vehicles?.map((v: any, i: number) => {
                                    const srv = services.find(s => s._id === v.serviceId);
                                    return (
                                        <div key={i} className="bg-charcoal-800 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold">{v.number}</p>
                                                    <p className="text-xs text-text-grey">{v.model || v.type}</p>
                                                </div>
                                                <span className="font-bold text-brand-blue">₹{v.price}</span>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-brand-blue" />
                                                    <span>{srv?.name || "Wash Service"}</span>
                                                </div>
                                                {v.addons && v.addons.length > 0 && (
                                                    <div className="pl-6 space-y-1.5 mt-1">
                                                        {v.addons.map((addonId: string, idx: number) => {
                                                            const detail = addons.find(a => a._id === addonId);
                                                            if (!detail) return null;
                                                            return (
                                                                <div key={idx} className="flex items-center gap-2 text-xs text-text-grey">
                                                                    <Plus className="w-3 h-3" />
                                                                    <span>{detail.name}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-grey mb-3 uppercase tracking-wider">Payment</h3>
                            <div className="bg-charcoal-800 p-4 rounded-xl border border-white/5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-grey">Method</span>
                                    <span className="font-medium uppercase">{booking.payment?.method || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-grey">Status</span>
                                    <span className={cn(
                                        "font-bold uppercase",
                                        booking.payment?.status === "PAID" ? "text-green-400" :
                                            booking.payment?.status === "REFUND_INITIATED" ? "text-purple-400" :
                                                "text-yellow-400"
                                    )}>
                                        {booking.payment?.status}
                                    </span>
                                </div>
                                {booking.payment?.transactionId && (
                                    <div className="flex justify-between">
                                        <span className="text-text-grey">Txn ID</span>
                                        <span className="font-medium font-mono text-xs">{booking.payment.transactionId}</span>
                                    </div>
                                )}
                                <div className="pt-3 mt-3 border-t border-white/5 flex justify-between items-center text-lg">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold text-brand-blue">₹{booking.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>

            {/* Edit Sheet */}
            <EditBookingSheet
                booking={booking}
                services={services}
                addons={addons}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSaved={() => { setEditOpen(false); afterAction(); }}
            />
        </>
    );
};
