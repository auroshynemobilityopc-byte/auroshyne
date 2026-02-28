import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

import { useBookingDetails } from "../hooks";
import {
    useAssignTechnician,
    useUpdatePayment,
    useUpdateStatus,
} from "../hooks";

import type {
    PaymentStatus,
} from "../types";


import { AssignTechnicianSheet } from "../components/AssignTechnicianSheet";
import { PaymentActions } from "../components/PaymentActions";
import { StatusActions } from "../components/StatusActions";
import { UpiTxnDrawer } from "../components/UpiTxnDrawer";

import { Button } from "../../../components/shared/Button";

export const BookingDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useBookingDetails(id);
    const booking = data;

    const [assignOpen, setAssignOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [upiOpen, setUpiOpen] = useState(false);

    const [paymentStatus, setPaymentStatus] =
        useState<PaymentStatus>("UNPAID");

    const assignMutation = useAssignTechnician();
    const paymentMutation = useUpdatePayment();
    const statusMutation = useUpdateStatus();

    if (isLoading || !booking) {
        return (
            <div className="flex justify-center items-center h-40 text-zinc-400 animate-pulse">
                Loading booking details...
            </div>
        );
    }

    const subtotal = booking.totalAmount + booking.discount;

    return (
        <div className="flex flex-col gap-5 animate-fadeIn pb-24">
            {/* 🔷 HEADER */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-white">
                            Booking #{booking.bookingId}
                        </h1>
                        <p className="text-sm text-zinc-400">
                            {new Date(booking.date).toDateString()} •{" "}
                            {booking.slot}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="h-10 px-3 sm:px-4 flex items-center gap-2 border border-zinc-800 hover:bg-zinc-900"
                            onClick={() => refetch()}
                        >
                            <span className="text-base">🔄</span>
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>

                        <Button
                            variant="ghost"
                            className="h-10 px-3 sm:px-4 flex items-center gap-2 border border-zinc-800 hover:bg-zinc-900"
                            onClick={() => navigate("/bookings")}
                        >
                            <span className="text-base">⬅️</span>
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                    </div>
                </div>

                {/* 💰 AMOUNT CARD */}
                <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/20 rounded-xl p-4">
                    <p className="text-sm text-zinc-400">
                        Total Amount
                    </p>
                    <p className="text-2xl font-bold text-white">
                        ₹{booking.totalAmount}
                    </p>
                </div>
            </div>

            {/* 👤 CUSTOMER CARD */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="font-medium text-white">
                    {booking.customer.name}
                </p>
                <p className="text-sm text-zinc-400">
                    {booking.customer.mobile}
                </p>
                <p className="text-sm text-zinc-500">
                    {booking.customer.address}
                </p>

                {booking.technicianId && (
                    <div className="mt-3 text-sm text-zinc-400">
                        👨‍🔧 {booking.technicianId.name} •{" "}
                        {booking.technicianId.mobile}
                    </div>
                )}

                {(() => {
                    const loc = booking.customer.mapLocation;
                    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return null;
                    return (
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> Pinned Location
                                </h3>
                                <button
                                    onClick={() => {
                                        const locStr = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
                                        if (navigator.clipboard && window.isSecureContext) {
                                            navigator.clipboard.writeText(locStr);
                                            toast.success("Location copied to clipboard!");
                                        } else {
                                            const textArea = document.createElement("textarea");
                                            textArea.value = locStr;
                                            document.body.appendChild(textArea);
                                            textArea.focus();
                                            textArea.select();
                                            try {
                                                document.execCommand('copy');
                                                toast.success("Location copied to clipboard!");
                                            } catch (err) {
                                                toast.error("Failed to copy location.");
                                            }
                                            document.body.removeChild(textArea);
                                        }
                                    }}
                                    className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-accent transition-colors"
                                >
                                    <Copy className="w-3.5 h-3.5" /> Copy
                                </button>
                            </div>
                            <div className="h-[150px] w-full rounded-xl overflow-hidden border border-zinc-800 z-0 relative">
                                <MapContainer
                                    center={[loc.lat, loc.lng]}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                                >
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[loc.lat, loc.lng]} />
                                </MapContainer>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* 🧾 BILL / PRICE BREAKDOWN */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h2 className="text-sm font-medium text-zinc-400 mb-3">
                    Price Details
                </h2>

                <div className="flex flex-col gap-2 text-sm">
                    {booking.vehicles.map((v) => (
                        <div key={v.number} className="flex flex-col gap-1">
                            <div className="flex justify-between text-zinc-300">
                                <span>
                                    {v.number} • {v.serviceId.name}
                                </span>
                                <span>₹{v.serviceId.price}</span>
                            </div>

                            {v.addons.map((addon, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between text-zinc-500 text-xs ml-2"
                                >
                                    <span>+ {addon.name}</span>
                                    <span>₹{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="border-t border-zinc-800 my-2" />

                    <div className="flex justify-between text-zinc-400">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    {booking.discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                            <span>Discount</span>
                            <span>-₹{booking.discount}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-white font-semibold text-base border-t border-zinc-700 pt-2 mt-2">
                        <span>Total</span>
                        <span>₹{booking.totalAmount}</span>
                    </div>

                    {booking.payment.method && (
                        <div className="flex justify-between text-zinc-400 text-xs mt-2">
                            <span>Payment Method</span>
                            <span>{booking.payment.method}</span>
                        </div>
                    )}

                    {booking.payment.transactionId && (
                        <div className="flex justify-between text-zinc-500 text-xs">
                            <span>Txn ID</span>
                            <span>
                                {booking.payment.transactionId}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <div className="w-full sm:w-auto">
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => setAssignOpen(true)}
                    >
                        👨‍🔧 Assign
                    </Button>
                </div>

                <div className="w-full sm:w-auto">
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => setStatusOpen(true)}
                    >
                        🔄 Status
                    </Button>
                </div>

                <div className="w-full sm:w-auto">
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => {
                            setPaymentStatus(booking.payment.status);
                            setPaymentOpen(true);
                        }}
                    >
                        💳 Payment
                    </Button>
                </div>
            </div>

            {/* 🧾 INVOICE NAV */}
            <div className="w-full sm:w-auto">
                <Button
                    className="w-full sm:w-auto"
                    onClick={() =>
                        navigate(`/admin/invoices/${booking.bookingId}`)
                    }
                >
                    View Invoice
                </Button>
            </div>

            {/* 📱 STICKY MOBILE ACTION BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-3 flex gap-3 md:hidden">
                <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={() => setAssignOpen(true)}
                >
                    Assign
                </Button>

                <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={() => setStatusOpen(true)}
                >
                    Status
                </Button>

                <Button
                    className="flex-1"
                    onClick={() => {
                        setPaymentStatus(booking.payment.status);
                        setPaymentOpen(true);
                    }}
                >
                    Pay
                </Button>
            </div>

            {/* DRAWERS */}
            <AssignTechnicianSheet
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
                onAssign={(id) =>
                    assignMutation.mutate(
                        { bookingId: booking.bookingId, technicianId: id },
                        {
                            onSuccess: () => {
                                setAssignOpen(false);
                                refetch();
                            },
                        }
                    )
                }
            />

            <PaymentActions
                open={paymentOpen}
                status={paymentStatus}
                onClose={() => setPaymentOpen(false)}
                onSelect={(status, method) => {
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
                }}
            />

            <UpiTxnDrawer
                open={upiOpen}
                onClose={() => setUpiOpen(false)}
                onSubmit={(transactionId) =>
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
                    )
                }
            />

            <StatusActions
                open={statusOpen}
                onClose={() => setStatusOpen(false)}
                onSelect={(status) =>
                    statusMutation.mutate(
                        { bookingId: booking.bookingId, status },
                        {
                            onSuccess: () => {
                                setStatusOpen(false);
                                refetch();
                            },
                        }
                    )
                }
            />
        </div>
    );
};