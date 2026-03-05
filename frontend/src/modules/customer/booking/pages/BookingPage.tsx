import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useCreateBooking, useServices, useAddons, useCreateCashfreeOrder, useVerifyCashfreePayment, useDeleteFailedBooking, useCheckSlotAvailability } from "../hooks";
import { useCustomerAuth } from "../../../../app/customer/CustomerAuthContext";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";

import type { BookingState, BookingStep } from "../types";
import CategoryStep from "../components/steps/CategoryStep";
import VehicleDetailsStep from "../components/steps/VehicleDetailsStep";
import ServiceSelectionStep from "../components/steps/ServiceSelectionStep";
import AddonSelectionStep from "../components/steps/AddonSelectionStep";
import DateSlotStep from "../components/steps/DateSlotStep";
import AddressStep from "../components/steps/AddressStep";
import ReviewStep from "../components/steps/ReviewStep";
import PaymentStep from "../components/steps/PaymentStep";
import BookingSummary from "../components/BookingSummary";

export default function BookingPage() {
    const navigate = useNavigate();
    const { user } = useCustomerAuth();
    const { mutate: createBooking, isPending } = useCreateBooking();
    const { mutateAsync: createCashfreeOrderAsync, isPending: isOrderPending } = useCreateCashfreeOrder();
    const { mutateAsync: verifyCashfreePaymentAsync, isPending: isVerifyPending } = useVerifyCashfreePayment();
    const { mutateAsync: deleteFailedBookingAsync } = useDeleteFailedBooking();
    const { data: servicesResult, isLoading: loadingServices } = useServices();
    const { data: addonsResult, isLoading: loadingAddons } = useAddons();

    const isProcessing = isPending || isOrderPending || isVerifyPending;

    // ─── Slot Availability State ──────────────────────────────────────
    // 'idle' = not yet checked, 'available' = slot free, 'unavailable' = slot full
    const [slotStatus, setSlotStatus] = useState<'idle' | 'available' | 'unavailable'>('idle');
    const [slotConflictVehicle, setSlotConflictVehicle] = useState<string | null>(null);
    const { mutate: checkSlot, isPending: isCheckingSlot } = useCheckSlotAvailability();

    const SERVICES = servicesResult?.data || [];
    const ADDONS = addonsResult?.data || [];

    const defaultBookingState: BookingState = {
        category: null,
        type: null,
        vehicles: [],
        serviceId: null,
        addonIds: [],
        date: null,
        slotId: null,
        address: { house: "", street: "", mobile: "", mapLocation: null },
        paymentMode: null,
        isBulkBooking: false,
        discountCode: null,
        discountValue: 0,
    };

    const getSavedState = () => {
        try {
            const saved = localStorage.getItem('bookingState');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse saved booking state", e);
        }
        return null;
    };

    const savedState = getSavedState();

    const [step, setStep] = useState<BookingStep>(savedState?.step || 1);
    const [booking, setBooking] = useState<BookingState>(savedState?.booking ? {
        ...defaultBookingState,
        ...savedState.booking,
        date: savedState.booking.date ? new Date(savedState.booking.date) : null
    } : defaultBookingState);

    useEffect(() => {
        localStorage.setItem('bookingState', JSON.stringify({ step, booking }));
    }, [step, booking]);

    const nextStep = () => setStep((s) => Math.min(s + 1, 8) as BookingStep);
    const prevStep = () => setStep((s) => Math.max(s - 1, 1) as BookingStep);

    const updateBooking = (updates: Partial<BookingState>) => {
        setBooking((prev) => ({ ...prev, ...updates }));
        // If the user changes date or slot, reset the availability check
        if ('date' in updates || 'slotId' in updates) {
            setSlotStatus('idle');
            setSlotConflictVehicle(null);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        booking.vehicles.forEach(vehicle => {
            if (vehicle.serviceId) {
                const service = SERVICES.find((s: any) => s._id === vehicle.serviceId);
                if (service) total += service.price || 0;
            }
            if (vehicle.addonIds) {
                vehicle.addonIds.forEach((id: string) => {
                    const addon = ADDONS.find((a: any) => a._id === id);
                    if (addon) total += addon.price;
                });
            }
        });
        return total;
    };

    const totalEstimate = calculateTotal();

    const stepProps = {
        booking,
        updateBooking,
        services: SERVICES,
        addons: ADDONS,
        loadingServices,
        loadingAddons,
        totalEstimate
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <CategoryStep {...stepProps} />;
            case 2: return <VehicleDetailsStep {...stepProps} />;
            case 3: return <ServiceSelectionStep {...stepProps} />;
            case 4: return <AddonSelectionStep {...stepProps} />;
            case 5: return <DateSlotStep {...stepProps} slotStatus={slotStatus} slotConflictVehicle={slotConflictVehicle} />;
            case 6: return <AddressStep {...stepProps} />;
            case 7: return <ReviewStep {...stepProps} />;
            case 8: return <PaymentStep {...stepProps} />;
            default: return null;
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return booking.category && booking.type;
            case 2: return booking.vehicles.every(v => v.number.length > 4);
            case 3: return booking.vehicles.every(v => v.serviceId);
            // Step 5: date+slot must be selected (availability is checked separately)
            case 5: return booking.date && booking.slotId;
            case 6:
                // Don't disable the button completely for step 6 if just map location is missing 
                // so we can show an alert on click. We still require house and mobile
                return booking.address.house.length > 0 && booking.address.mobile.length >= 10;
            case 8: return booking.paymentMode;
            default: return true;
        }
    };

    // Handle the Step-5 "Check Availability" button click
    const handleCheckAvailability = () => {
        if (!booking.date || !booking.slotId) return;
        const dateStr = format(booking.date, 'yyyy-MM-dd');
        const slotStr = booking.slotId.toUpperCase();
        // Collect all vehicle numbers selected in step 2
        const vehicleNumbers = booking.vehicles.map(v => v.number).filter(Boolean);

        checkSlot(
            { date: dateStr, slot: slotStr, vehicleNumbers },
            {
                onSuccess: (res: any) => {
                    if (res?.data?.available) {
                        setSlotStatus('available');
                        setSlotConflictVehicle(null);
                    } else {
                        setSlotStatus('unavailable');
                        setSlotConflictVehicle(res?.data?.conflictingVehicle || null);
                    }
                },
                onError: () => {
                    toast.error('Could not check slot availability. Please try again.');
                    setSlotStatus('idle');
                    setSlotConflictVehicle(null);
                }
            }
        );
    };

    return (
        <div className="p-6 pb-48 md:pb-12 md:pt-12">
            <div className="md:grid md:grid-cols-12 md:gap-12">

                {/* LEFT COLUMN: STEPS */}
                <div className="md:col-span-8">
                    {/* Progress Bar & Cancel Button */}
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-brand-blue"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / 8) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-text-grey font-mono">
                                <span>Step {step} of 8</span>
                                <span>{step === 8 ? 'Payment' : 'Booking'}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to cancel the booking and start over?")) {
                                    localStorage.removeItem('bookingState');
                                    setStep(1);
                                    setBooking(defaultBookingState);
                                }
                            }}
                            className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors font-medium whitespace-nowrap"
                        >
                            Cancel / Restart
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="min-h-[400px]"
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: SUMMARY (DESKTOP ONLY) */}
                <BookingSummary {...stepProps} />
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-20 md:bottom-0 left-0 right-0 p-4 bg-charcoal-900/90 backdrop-blur-lg border-t border-white/5 md:border-none md:bg-transparent md:static md:p-0 md:mt-8 z-40">
                <div className="max-w-md mx-auto md:max-w-none md:flex md:justify-end gap-3">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                    )}

                    <div className="flex gap-3 md:w-auto w-full">
                        {step > 1 && (
                            <button
                                onClick={prevStep}
                                className="md:hidden p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                // ── Step 5: Check Availability first, then Continue ──
                                if (step === 5) {
                                    if (slotStatus === 'available') {
                                        // Already verified — move to next step
                                        nextStep();
                                    } else {
                                        handleCheckAvailability();
                                    }
                                    return;
                                }

                                if (step === 6 && !booking.address.mapLocation) {
                                    toast.error("Please select a location on the map before continuing.");
                                    return;
                                }

                                if (step === 8) {
                                    if (!booking.date || !booking.slotId) return;

                                    const payload = {
                                        customer: {
                                            name: user?.name || "Customer",
                                            mobile: booking.address.mobile,
                                            address: `${booking.address.house}, ${booking.address.street}`,
                                            apartmentName: booking.address.house,
                                            mapLocation: booking.address.mapLocation || undefined,
                                        },
                                        category: booking.category,
                                        paymentMode: booking.paymentMode,
                                        vehicles: booking.vehicles.map(v => ({
                                            type: v.type === 'two-wheeler' ? '2W' : (v.type === 'cab' ? 'CAB' : '4W'),
                                            number: v.number,
                                            model: v.model,
                                            cc: v.cc,
                                            serviceId: v.serviceId,
                                            addons: v.addonIds || []
                                        })),
                                        slot: booking.slotId.toUpperCase(),
                                        date: format(booking.date, 'yyyy-MM-dd'),
                                        discountCode: booking.discountCode || undefined
                                    };

                                    createBooking(payload, {
                                        onSuccess: async (data: any) => {
                                            const bookingId = data?.data?.bookingId;

                                            if ((payload.paymentMode === 'online' || payload.paymentMode === 'upi') && bookingId) {
                                                try {
                                                    // 1. Create order and get session ID
                                                    const orderData = await createCashfreeOrderAsync(bookingId);
                                                    const paymentSessionId = orderData?.data?.payment_session_id;
                                                    const orderId = orderData?.data?.order_id;

                                                    if (!paymentSessionId) {
                                                        throw new Error("Could not initialize payment session.");
                                                    }

                                                    // 2. Load SDK
                                                    const cashfree = await load({ mode: "sandbox" });

                                                    // 3. Start Checkout
                                                    cashfree.checkout({
                                                        paymentSessionId,
                                                        redirectTarget: "_modal",
                                                    }).then(async (result: any) => {
                                                        if (result.error) {
                                                            toast.error(result.error.message || "Payment failed or was cancelled.");
                                                            // Delete the abandoned booking
                                                            await deleteFailedBookingAsync(bookingId);
                                                            // Stay on the booking page so they can retry
                                                        } else if (result.paymentDetails || result.redirect === false) {
                                                            // Verify the payment
                                                            try {
                                                                await verifyCashfreePaymentAsync(orderId);
                                                                localStorage.removeItem('bookingState');
                                                                navigate("/history");
                                                            } catch (verifyErr) {
                                                                toast.error("Payment verification failed. Please check history or contact support.");
                                                            }
                                                        }
                                                    });

                                                } catch (err: any) {
                                                    console.error("Payment Error:", err);
                                                    toast.error("An error occurred starting payment.");
                                                    await deleteFailedBookingAsync(bookingId);
                                                    // Stay on page on error
                                                }
                                            } else {
                                                // CASH payment mode or missing ID
                                                localStorage.removeItem('bookingState');
                                                navigate("/history");
                                            }
                                        }
                                    });
                                } else {
                                    nextStep();
                                }
                            }}
                            disabled={
                                !canProceed() ||
                                isProcessing ||
                                isCheckingSlot ||
                                (step === 5 && slotStatus === 'unavailable')
                            }
                            className="flex-1 md:flex-none md:w-64 bg-brand-blue hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl p-4 md:px-8 md:py-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
                        >
                            {isCheckingSlot
                                ? 'Checking...'
                                : isProcessing
                                    ? 'Processing...'
                                    : step === 8
                                        ? 'Confirm Booking'
                                        : step === 5 && slotStatus !== 'available'
                                            ? 'Check Availability'
                                            : 'Continue'
                            }
                            {!isCheckingSlot && !isProcessing && step !== 8 && <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
