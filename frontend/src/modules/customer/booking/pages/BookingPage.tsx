import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useCreateBooking, useServices, useAddons } from "../hooks";
import { useCustomerAuth } from "../../../../app/customer/CustomerAuthContext";

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
    const { data: servicesResult, isLoading: loadingServices } = useServices();
    const { data: addonsResult, isLoading: loadingAddons } = useAddons();

    const SERVICES = servicesResult?.data || [];
    const ADDONS = addonsResult?.data || [];

    const [step, setStep] = useState<BookingStep>(1);
    const [booking, setBooking] = useState<BookingState>({
        category: null,
        type: null,
        vehicles: [],
        serviceId: null,
        addonIds: [],
        date: null,
        slotId: null,
        address: { house: "", street: "", mobile: "" },
        paymentMode: null,
        isBulkBooking: false,
        discountCode: null,
        discountValue: 0,
    });

    const nextStep = () => setStep((s) => Math.min(s + 1, 8) as BookingStep);
    const prevStep = () => setStep((s) => Math.max(s - 1, 1) as BookingStep);

    const updateBooking = (updates: Partial<BookingState>) => {
        setBooking((prev) => ({ ...prev, ...updates }));
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
            case 5: return <DateSlotStep {...stepProps} />;
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
            case 5: return booking.date && booking.slotId;
            case 6: return booking.address.house.length > 0 && booking.address.mobile.length >= 10;
            case 8: return booking.paymentMode;
            default: return true;
        }
    };

    return (
        <div className="p-6 pb-48 md:pb-12 md:pt-12">
            <div className="md:grid md:grid-cols-12 md:gap-12">

                {/* LEFT COLUMN: STEPS */}
                <div className="md:col-span-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
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
                                if (step === 8) {
                                    if (!booking.date || !booking.slotId) return;

                                    const payload = {
                                        customer: {
                                            name: user?.name || "Customer",
                                            mobile: booking.address.mobile,
                                            address: `${booking.address.house}, ${booking.address.street}`,
                                            apartmentName: booking.address.house,
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
                                        onSuccess: () => navigate("/history")
                                    });
                                } else {
                                    nextStep();
                                }
                            }}
                            disabled={!canProceed() || isPending}
                            className="flex-1 md:flex-none md:w-64 bg-brand-blue hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl p-4 md:px-8 md:py-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
                        >
                            {isPending ? 'Processing...' : (step === 8 ? 'Confirm Booking' : 'Continue')}
                            {!isPending && step !== 8 && <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
