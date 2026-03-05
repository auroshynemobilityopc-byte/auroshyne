import { format } from "date-fns";
import { cn, SLOTS } from "../../../lib/utils";
import type { StepProps } from "../../types";
import { useSettings } from "../../../../../modules/settings/hooks";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DateSlotStep({ booking, updateBooking, slotStatus = 'idle', slotConflictVehicle }: StepProps) {
    const { data: settingsData } = useSettings();
    const daysToShow = settingsData?.data?.bookingDays || 7;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold mb-4">Select Date</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {Array.from({ length: daysToShow }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const isSelected = booking.date?.toDateString() === date.toDateString();

                        return (
                            <button
                                key={i}
                                onClick={() => updateBooking({ date })}
                                className={cn(
                                    "flex-shrink-0 w-16 h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                                    isSelected ? "bg-brand-blue border-brand-blue text-white" : "bg-charcoal-800 border-white/10 text-text-grey"
                                )}
                            >
                                <span className="text-xs font-medium uppercase">{format(date, 'EEE')}</span>
                                <span className="text-xl font-bold">{format(date, 'd')}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Select Time Slot</h2>
                <div className="space-y-3">
                    {SLOTS.map((slot) => (
                        <button
                            key={slot.id}
                            onClick={() => updateBooking({ slotId: slot.id })}
                            className={cn(
                                "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                                booking.slotId === slot.id ? "border-brand-blue bg-brand-blue/10" : "bg-charcoal-800 border-white/10 hover:border-white/20"
                            )}
                        >
                            <span className="font-medium">{slot.label}</span>
                            <span className="text-sm text-text-grey">{slot.time}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Slot Availability Status Banner */}
            <AnimatePresence mode="wait">
                {slotStatus !== 'idle' && (
                    <motion.div
                        key={slotStatus}
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className={cn(
                            "rounded-xl border p-4 flex items-start gap-3",
                            slotStatus === 'available'
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-red-500/10 border-red-500/30"
                        )}
                    >
                        {slotStatus === 'available' ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-green-400">Slot Available!</p>
                                    <p className="text-sm text-text-grey mt-0.5">
                                        Great news — this slot is open. Click <strong className="text-white">Continue</strong> to proceed.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    {slotConflictVehicle ? (
                                        <>
                                            <p className="font-semibold text-red-400">Vehicle Already Booked</p>
                                            <p className="text-sm text-text-grey mt-0.5">
                                                Vehicle <strong className="text-white">{slotConflictVehicle}</strong> is already booked for this slot.
                                                Please select a different date or time.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-semibold text-red-400">Slot Fully Booked</p>
                                            <p className="text-sm text-text-grey mt-0.5">
                                                This slot is already full. Please select a different date or time slot.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {slotStatus === 'idle' && booking.date && booking.slotId && (
                    <motion.div
                        key="hint"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3"
                    >
                        <Clock className="w-5 h-5 text-brand-blue flex-shrink-0" />
                        <p className="text-sm text-text-grey">
                            Click <strong className="text-white">Check Availability</strong> to confirm this slot is open before proceeding.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
