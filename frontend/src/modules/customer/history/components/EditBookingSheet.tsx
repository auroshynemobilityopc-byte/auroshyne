import { useState, useEffect } from "react";
import { Drawer } from "../../../../components/shared/Drawer";
import { X, CheckCircle, Plus, Minus } from "lucide-react";
import { cn } from "../../lib/utils";
import { useUpdateBooking } from "../../booking/hooks";

interface Props {
    booking: any;
    services: any[];
    addons: any[];
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export const EditBookingSheet = ({ booking, services, addons, open, onClose, onSaved }: Props) => {
    const updateMutation = useUpdateBooking(onSaved);

    const [address, setAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [mobile, setMobile] = useState("");
    const [vehicles, setVehicles] = useState<any[]>([]);

    // Seed form from booking whenever it changes
    useEffect(() => {
        if (!booking) return;
        setAddress(booking.customer?.address || "");
        setApartment(booking.customer?.apartmentName || "");
        setMobile(booking.customer?.mobile || "");
        setVehicles(
            (booking.vehicles || []).map((v: any) => ({
                originalNumber: v.number,
                number: v.number,
                model: v.model || "",
                type: v.type,
                serviceId: v.serviceId || "",
                addons: (v.addons || []).map((a: any) => (typeof a === "string" ? a : a._id)),
            }))
        );
    }, [booking]);

    if (!booking) return null;

    const toggleAddon = (vehicleIdx: number, addonId: string) => {
        setVehicles(prev =>
            prev.map((v, i) => {
                if (i !== vehicleIdx) return v;
                const has = v.addons.includes(addonId);
                return { ...v, addons: has ? v.addons.filter((a: string) => a !== addonId) : [...v.addons, addonId] };
            })
        );
    };

    const updateVehicleField = (idx: number, field: string, value: string) => {
        setVehicles(prev => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            bookingId: booking.bookingId,
            customer: { address, mobile, apartmentName: apartment },
            vehicles: vehicles.map(v => ({
                originalNumber: v.originalNumber,
                number: v.number,
                model: v.model,
                serviceId: v.serviceId,
                addons: v.addons,
            })),
        });
        onClose();
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="flex flex-col h-full max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 border-b border-zinc-800 pb-4">
                    <div>
                        <span className="text-xs font-mono text-zinc-500">#{booking.bookingId}</span>
                        <h2 className="text-xl font-bold">Edit Booking</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pb-40 md:pb-24 pr-1">

                    {/* Address */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Address</h3>
                        <textarea
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Full address"
                            rows={2}
                            className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-brand-blue/50"
                        />
                        <input
                            value={apartment}
                            onChange={e => setApartment(e.target.value)}
                            placeholder="Apartment / Building (optional)"
                            className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-brand-blue/50"
                        />
                        <input
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                            placeholder="Contact number"
                            className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-brand-blue/50"
                        />
                    </div>

                    {/* Vehicles */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Vehicles</h3>
                        {vehicles.map((v, idx) => {
                            // Only show services & addons that apply to this vehicle type
                            const vehicleServices = services.filter(s => s.vehicleType === v.type);
                            const vehicleAddons = addons.filter(a => a.vehicleType === v.type);

                            return (
                                <div key={idx} className="bg-charcoal-800 rounded-xl border border-white/5 p-4 space-y-4">
                                    <p className="text-xs text-zinc-500 font-mono">Vehicle #{idx + 1}
                                        <span className="ml-2 px-1.5 py-0.5 bg-white/5 rounded text-zinc-400">{v.type}</span>
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-zinc-400 mb-1 block">Reg. Number</label>
                                            <input
                                                value={v.number}
                                                onChange={e => updateVehicleField(idx, "number", e.target.value.toUpperCase())}
                                                placeholder="e.g. KA01AB1234"
                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-brand-blue/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-400 mb-1 block">Model</label>
                                            <input
                                                value={v.model}
                                                onChange={e => updateVehicleField(idx, "model", e.target.value)}
                                                placeholder="e.g. Swift"
                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50"
                                            />
                                        </div>
                                    </div>

                                    {/* Service Select — filtered to this vehicle type */}
                                    <div>
                                        <label className="text-xs text-zinc-400 mb-1 block">
                                            Service <span className="text-zinc-600">({v.type})</span>
                                        </label>
                                        <div className="space-y-2">
                                            {vehicleServices.length === 0 ? (
                                                <p className="text-xs text-zinc-500 italic">No services available for {v.type}</p>
                                            ) : vehicleServices.map((s: any) => (
                                                <button
                                                    key={s._id}
                                                    type="button"
                                                    onClick={() => updateVehicleField(idx, "serviceId", s._id)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-colors",
                                                        v.serviceId === s._id
                                                            ? "border-brand-blue bg-brand-blue/10 text-white"
                                                            : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className={cn("w-4 h-4", v.serviceId === s._id ? "text-brand-blue" : "text-zinc-600")} />
                                                        <span>{s.name}</span>
                                                    </div>
                                                    <span className="font-semibold text-brand-blue">₹{s.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Addons — filtered to this vehicle type */}
                                    {vehicleAddons.length > 0 && (
                                        <div>
                                            <label className="text-xs text-zinc-400 mb-2 block">
                                                Add-ons <span className="text-zinc-600">({v.type})</span>
                                            </label>
                                            <div className="space-y-2">
                                                {vehicleAddons.map((a: any) => {
                                                    const selected = v.addons.includes(a._id);
                                                    return (
                                                        <button
                                                            key={a._id}
                                                            type="button"
                                                            onClick={() => toggleAddon(idx, a._id)}
                                                            className={cn(
                                                                "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors",
                                                                selected
                                                                    ? "border-green-500/40 bg-green-500/10 text-white"
                                                                    : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20"
                                                            )}
                                                        >
                                                            <span>{a.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-zinc-400">+₹{a.price}</span>
                                                                {selected ? <Minus className="w-3.5 h-3.5 text-green-400" /> : <Plus className="w-3.5 h-3.5 text-zinc-500" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </form>

                {/* Sticky Save Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 md:pb-4 bg-charcoal-900/95 backdrop-blur border-t border-white/5">
                    <button
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending}
                        className="w-full bg-brand-blue hover:bg-brand-accent disabled:opacity-50 text-white font-bold rounded-xl py-4 transition-all"
                    >
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </Drawer>
    );
};
