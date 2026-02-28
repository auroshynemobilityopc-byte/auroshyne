import { format } from "date-fns";
import { cn, SLOTS } from "../../../lib/utils";
import type { StepProps } from "../../types";
import { useSettings } from "../../../../../modules/settings/hooks";

export default function DateSlotStep({ booking, updateBooking }: StepProps) {
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
        </div>
    );
}
