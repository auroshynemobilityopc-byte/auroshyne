import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Car, Bike, Truck, Plus, Minus, BookMarked, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { StepProps, VehicleType, Vehicle } from "../../types";
import { useSavedData } from "../../../profile/hooks";

export default function VehicleDetailsStep({ booking, updateBooking }: StepProps) {
    const { data: savedResult } = useSavedData();
    const savedVehicles: any[] = savedResult?.data?.savedVehicles ?? [];

    // Track which saved vehicle IDs are already used per booking vehicle slot
    const [showSaved, setShowSaved] = useState<Record<string, boolean>>({});
    const [appliedSavedId, setAppliedSavedId] = useState<Record<string, string>>({});

    const toggleSavedPanel = (vehicleId: string) =>
        setShowSaved(prev => ({ ...prev, [vehicleId]: !prev[vehicleId] }));

    // Filter saved vehicles matching the booking vehicle type
    const compatibleSaved = (vehicleId: string) => {
        const bv = booking.vehicles.find(v => v.id === vehicleId);
        if (!bv) return savedVehicles;
        // Map booking types to saved vehicle types
        const typeMap: Record<string, string> = {
            "two-wheeler": "2W",
            "four-wheeler": "4W",
            "cab": "CAB",
        };
        const expectedType = typeMap[bv.type ?? "four-wheeler"];
        return savedVehicles.filter(sv => sv.type === expectedType);
    };

    const applySaved = (vehicleId: string, sv: any) => {
        setAppliedSavedId(prev => ({ ...prev, [vehicleId]: sv._id }));
        setShowSaved(prev => ({ ...prev, [vehicleId]: false }));
        const newVehicles = booking.vehicles.map(v =>
            v.id === vehicleId
                ? { ...v, number: sv.number, model: sv.model || v.model }
                : v
        );
        updateBooking({ vehicles: newVehicles });
    };

    const vehicleTypeIcon = (type: string) => {
        if (type === "2W") return <Bike className="w-4 h-4" />;
        if (type === "CAB") return <Truck className="w-4 h-4" />;
        return <Car className="w-4 h-4" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Vehicle Details</h2>
                <label className="flex items-center gap-2 cursor-pointer bg-charcoal-800 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                    <input
                        type="checkbox"
                        checked={booking.isBulkBooking}
                        onChange={(e) => updateBooking({ isBulkBooking: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-600 text-brand-blue focus:ring-brand-blue bg-transparent"
                    />
                    <span className="text-sm font-medium">Bulk Booking</span>
                </label>
            </div>

            <div className="space-y-6">
                {booking.vehicles.map((vehicle, index) => {
                    const compatible = compatibleSaved(vehicle.id);
                    const isOpen = showSaved[vehicle.id];
                    const appliedId = appliedSavedId[vehicle.id];

                    return (
                        <motion.div
                            key={vehicle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-charcoal-800 p-4 rounded-2xl border border-white/10 relative space-y-4"
                        >
                            {booking.isBulkBooking && (
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="font-bold text-sm text-brand-blue">Vehicle {index + 1}</span>
                                    {booking.vehicles.length > 1 && (
                                        <button
                                            onClick={() => {
                                                const newVehicles = booking.vehicles.filter(v => v.id !== vehicle.id);
                                                updateBooking({ vehicles: newVehicles });
                                            }}
                                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                                        >
                                            <Minus className="w-3 h-3" /> Remove
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Saved Vehicle Quick-Pick ── */}
                            {compatible.length > 0 && (
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleSavedPanel(vehicle.id)}
                                        className="flex items-center justify-between w-full text-xs font-semibold text-brand-blue"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <BookMarked className="w-3.5 h-3.5" />
                                            {appliedId ? "Saved vehicle applied ✓" : `Use Saved Vehicle (${compatible.length})`}
                                        </span>
                                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 pt-1">
                                                    {compatible.map((sv: any) => {
                                                        const isSelected = appliedId === sv._id;
                                                        return (
                                                            <button
                                                                key={sv._id}
                                                                type="button"
                                                                onClick={() => applySaved(vehicle.id, sv)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all",
                                                                    isSelected
                                                                        ? "border-brand-blue bg-brand-blue/10"
                                                                        : "border-white/10 bg-charcoal-900 hover:border-brand-blue/40"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                                                                    isSelected ? "bg-brand-blue/20 text-brand-blue" : "bg-white/5 text-zinc-400"
                                                                )}>
                                                                    {vehicleTypeIcon(sv.type)}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-sm uppercase tracking-wide text-white">{sv.number}</p>
                                                                    <p className="text-xs text-zinc-400">{sv.model || sv.type}{sv.label ? ` · ${sv.label}` : ""}</p>
                                                                </div>
                                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <div className="flex-1 h-px bg-white/10" />
                                        or enter manually
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {booking.isBulkBooking && (
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-grey">Vehicle Type</label>
                                        <div className="flex gap-2">
                                            {[
                                                { id: 'two-wheeler', label: '2W', icon: Bike },
                                                { id: 'four-wheeler', label: '4W', icon: Car },
                                                { id: 'cab', label: 'Cab', icon: Truck, hidden: booking.category === 'private' }
                                            ].filter(t => !t.hidden).map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => {
                                                        const newVehicles = booking.vehicles.map(v =>
                                                            v.id === vehicle.id ? { ...v, type: type.id as VehicleType } : v
                                                        );
                                                        updateBooking({ vehicles: newVehicles });
                                                        // Clear applied saved vehicle when type changes
                                                        setAppliedSavedId(prev => { const n = { ...prev }; delete n[vehicle.id]; return n; });
                                                    }}
                                                    className={cn(
                                                        "flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 text-sm transition-all",
                                                        vehicle.type === type.id
                                                            ? "bg-brand-blue text-white border-brand-blue"
                                                            : "bg-white/5 border-white/10 text-text-grey hover:bg-white/10"
                                                    )}
                                                >
                                                    <type.icon className="w-4 h-4" />
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm text-text-grey">Vehicle Number <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. TS 09 AB 1234"
                                        value={vehicle.number}
                                        onChange={(e) => {
                                            setAppliedSavedId(prev => { const n = { ...prev }; delete n[vehicle.id]; return n; });
                                            updateBooking({
                                                vehicles: booking.vehicles.map(v =>
                                                    v.id === vehicle.id ? { ...v, number: e.target.value.toUpperCase() } : v
                                                )
                                            });
                                        }}
                                        className="w-full bg-charcoal-900 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none transition-colors placeholder:text-white/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-grey">Model (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Swift"
                                            value={vehicle.model}
                                            onChange={(e) => {
                                                updateBooking({
                                                    vehicles: booking.vehicles.map(v =>
                                                        v.id === vehicle.id ? { ...v, model: e.target.value } : v
                                                    )
                                                });
                                            }}
                                            className="w-full bg-charcoal-900 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-grey">CC (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1200"
                                            value={vehicle.cc}
                                            onChange={(e) => {
                                                updateBooking({
                                                    vehicles: booking.vehicles.map(v =>
                                                        v.id === vehicle.id ? { ...v, cc: e.target.value } : v
                                                    )
                                                });
                                            }}
                                            className="w-full bg-charcoal-900 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-grey">Vehicle Image (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            updateBooking({
                                                vehicles: booking.vehicles.map(v =>
                                                    v.id === vehicle.id ? { ...v, image: file } : v
                                                )
                                            });
                                        }}
                                        className="w-full bg-charcoal-900 border border-white/10 rounded-xl p-3 text-sm text-text-grey file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-accent"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {booking.isBulkBooking && (
                    <button
                        onClick={() => {
                            const newVehicle: Vehicle = {
                                id: Math.random().toString(36).substr(2, 9),
                                number: "",
                                model: "",
                                cc: "",
                                type: booking.type || 'four-wheeler',
                                image: null,
                            };
                            updateBooking({ vehicles: [...booking.vehicles, newVehicle] });
                        }}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-text-grey hover:border-brand-blue hover:text-brand-blue transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus className="w-5 h-5" /> Add Another Vehicle
                    </button>
                )}
            </div>
        </div>
    );
}
