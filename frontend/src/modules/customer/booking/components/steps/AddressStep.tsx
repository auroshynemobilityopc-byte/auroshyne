import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ChevronDown, ChevronUp, CheckCircle2, Home, Briefcase } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { StepProps } from "../../types";
import { useSavedData } from "../../../profile/hooks";

export default function AddressStep({ booking, updateBooking }: StepProps) {
    const { data: savedResult } = useSavedData();
    const savedAddresses: any[] = savedResult?.data?.savedAddresses ?? [];

    const [showSaved, setShowSaved] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const applyAddress = (a: any) => {
        setSelectedId(a._id);
        updateBooking({
            address: {
                house: a.apartmentName || "",
                street: a.address || "",
                mobile: a.mobile || booking.address.mobile,
            },
        });
    };

    const labelIcons: Record<string, any> = { Home, Office: Briefcase, Work: Briefcase };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Location Details</h2>

            {/* ── Saved Addresses Quick-Pick ── */}
            {savedAddresses.length > 0 && (
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => setShowSaved(v => !v)}
                        className="flex items-center justify-between w-full text-sm font-semibold text-brand-blue"
                    >
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            Use a Saved Address
                        </span>
                        {showSaved ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                        {showSaved && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 pt-1">
                                    {savedAddresses.map((a: any) => {
                                        const Icon = labelIcons[a.label] || MapPin;
                                        const isSelected = selectedId === a._id;
                                        return (
                                            <button
                                                key={a._id}
                                                type="button"
                                                onClick={() => applyAddress(a)}
                                                className={cn(
                                                    "w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all",
                                                    isSelected
                                                        ? "border-brand-blue bg-brand-blue/10"
                                                        : "border-white/10 bg-charcoal-800 hover:border-brand-blue/40"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                                    isSelected ? "bg-brand-blue/20" : "bg-white/5"
                                                )}>
                                                    <Icon className={cn("w-4 h-4", isSelected ? "text-brand-blue" : "text-zinc-400")} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-white">{a.label}</p>
                                                    <p className="text-xs text-zinc-400 truncate">{a.address}</p>
                                                    {a.apartmentName && <p className="text-xs text-zinc-500 truncate">{a.apartmentName}</p>}
                                                </div>
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <div className="flex-1 h-px bg-white/10" />
                        or fill manually
                        <div className="flex-1 h-px bg-white/10" />
                    </div>
                </div>
            )}

            {/* ── Manual Form ── */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-grey">House / Flat / Apartment Name <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        value={booking.address.house}
                        onChange={(e) => {
                            setSelectedId(null);
                            updateBooking({ address: { ...booking.address, house: e.target.value } });
                        }}
                        className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-grey">Street / Landmark <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        value={booking.address.street}
                        onChange={(e) => {
                            setSelectedId(null);
                            updateBooking({ address: { ...booking.address, street: e.target.value } });
                        }}
                        className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-grey">Mobile Number <span className="text-red-400">*</span></label>
                    <input
                        type="tel"
                        value={booking.address.mobile}
                        onChange={(e) => updateBooking({ address: { ...booking.address, mobile: e.target.value } })}
                        className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                    />
                </div>

                <div className="pt-4 space-y-3">
                    {booking.isBulkBooking && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                        >
                            <label className="text-sm text-text-grey">Society / Apartment Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Prestige High Fields"
                                value={booking.address.house}
                                onChange={(e) => updateBooking({ address: { ...booking.address, house: e.target.value } })}
                                className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                            />
                            <p className="text-xs text-brand-blue bg-brand-blue/10 p-2 rounded-lg">
                                Bulk booking active: {booking.vehicles.length} vehicle(s) added.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
