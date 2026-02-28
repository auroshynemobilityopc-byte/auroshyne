import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, MapPin, Car, Plus, Trash2, Home, Briefcase,
    Bike, X
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
    useSavedData,
    useAddAddress, useDeleteAddress,
    useAddVehicle, useDeleteVehicle,
} from "../hooks";

/* ──────────── Small inline form components ──────────── */

const VEHICLE_TYPES = [
    { value: "2W", label: "2-Wheeler", icon: Bike },
    { value: "4W", label: "4-Wheeler", icon: Car },
    { value: "CAB", label: "Cab / SUV", icon: Car },
];

const labelIcons: Record<string, any> = { Home, Office: Briefcase };
const LABEL_PRESETS = ["Home", "Office", "Work", "Other"];

function AddressForm({ onDone }: { onDone: () => void }) {
    const { mutate: add, isPending } = useAddAddress();
    const [label, setLabel] = useState("Home");
    const [customLabel, setCustomLabel] = useState("");
    const [address, setAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [mobile, setMobile] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalLabel = label === "Other" ? customLabel.trim() : label;
        if (!finalLabel || !address.trim()) return;
        add({ label: finalLabel, address: address.trim(), apartmentName: apartment.trim(), mobile: mobile.trim() }, { onSuccess: onDone });
    };

    return (
        <form onSubmit={submit} className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-sm font-bold text-white mb-2">New Address</p>

            {/* Label Chips */}
            <div className="flex flex-wrap gap-2">
                {LABEL_PRESETS.map(l => (
                    <button key={l} type="button" onClick={() => setLabel(l)}
                        className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                            label === l ? "border-brand-blue bg-brand-blue/20 text-brand-blue" : "border-white/10 bg-white/5 text-zinc-400")}
                    >{l}</button>
                ))}
            </div>
            {label === "Other" && (
                <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} placeholder="Custom label"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue/50" />
            )}

            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address *" rows={2} required
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-brand-blue/50" />
            <input value={apartment} onChange={e => setApartment(e.target.value)} placeholder="Apartment / Building (optional)"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue/50" />
            <div className="flex gap-2">
                <span className="bg-zinc-900 border border-r-0 border-white/10 rounded-l-xl px-3 py-2.5 text-sm text-zinc-400 shrink-0">+91</span>
                <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ""))} maxLength={10} placeholder="Mobile (optional)"
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-r-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue/50 min-w-0" />
            </div>

            <div className="flex gap-2 pt-1">
                <button type="button" onClick={onDone}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-zinc-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={isPending || !address.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-accent disabled:opacity-50 text-sm font-bold text-white transition-colors">
                    {isPending ? "Saving..." : "Save Address"}
                </button>
            </div>
        </form>
    );
}

function VehicleForm({ onDone }: { onDone: () => void }) {
    const { mutate: add, isPending } = useAddVehicle();
    const [label, setLabel] = useState("");
    const [number, setNumber] = useState("");
    const [type, setType] = useState("2W");
    const [model, setModel] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!number.trim()) return;
        add({ label: label.trim(), number: number.trim().toUpperCase(), type, model: model.trim() }, { onSuccess: onDone });
    };

    return (
        <form onSubmit={submit} className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-sm font-bold text-white mb-2">New Vehicle</p>

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2">
                {VEHICLE_TYPES.map(vt => (
                    <button key={vt.value} type="button" onClick={() => setType(vt.value)}
                        className={cn("flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors",
                            type === vt.value ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 bg-white/5 text-zinc-400")}
                    >
                        <vt.icon className={cn("w-5 h-5", type === vt.value ? "text-brand-blue" : "text-zinc-500")} />
                        {vt.label}
                    </button>
                ))}
            </div>

            <input value={number} onChange={e => setNumber(e.target.value.toUpperCase())} placeholder="Reg. Number *  (e.g. KA01AB1234)" required
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white uppercase placeholder-zinc-500 placeholder-normal focus:outline-none focus:border-brand-blue/50" />
            <div className="grid grid-cols-2 gap-2">
                <input value={model} onChange={e => setModel(e.target.value)} placeholder="Model (e.g. Activa)"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue/50" />
                <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. My Bike)"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue/50" />
            </div>

            <div className="flex gap-2 pt-1">
                <button type="button" onClick={onDone}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-zinc-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={isPending || !number.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-accent disabled:opacity-50 text-sm font-bold text-white transition-colors">
                    {isPending ? "Saving..." : "Save Vehicle"}
                </button>
            </div>
        </form>
    );
}

/* ──────────── Main Page ──────────── */

export default function SavedDataPage() {
    const navigate = useNavigate();
    const { data, isLoading } = useSavedData();
    const { mutate: deleteAddr, isPending: deletingAddr } = useDeleteAddress();
    const { mutate: deleteVeh, isPending: deletingVeh } = useDeleteVehicle();

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [confirmDeleteType, setConfirmDeleteType] = useState<"address" | "vehicle">("address");

    const addresses: any[] = data?.data?.savedAddresses ?? [];
    const vehicles: any[] = data?.data?.savedVehicles ?? [];

    const confirmDelete = (id: string, type: "address" | "vehicle") => {
        setConfirmDeleteId(id);
        setConfirmDeleteType(type);
    };

    const doDelete = () => {
        if (!confirmDeleteId) return;
        if (confirmDeleteType === "address") deleteAddr(confirmDeleteId, { onSuccess: () => setConfirmDeleteId(null) });
        else deleteVeh(confirmDeleteId, { onSuccess: () => setConfirmDeleteId(null) });
    };

    const vehicleTypeIcon = (type: string) => {
        if (type === "2W") return <Bike className="w-4 h-4 text-brand-blue" />;
        return <Car className="w-4 h-4 text-brand-blue" />;
    };

    return (
        <div className="pb-28 md:max-w-lg md:mx-auto w-full">
            {/* Top Bar */}
            <div className="flex items-center gap-4 px-4 pt-6 pb-4">
                <button onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-zinc-300" />
                </button>
                <div>
                    <h1 className="text-xl font-bold leading-tight">Saved Data</h1>
                    <p className="text-xs text-zinc-500">Quick-fill in bookings</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center mt-16">
                    <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="px-4 space-y-8">

                    {/* ──── Addresses ──── */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-brand-blue" /> Addresses
                                <span className="text-xs font-normal text-zinc-500 ml-1">({addresses.length})</span>
                            </h2>
                            {!showAddressForm && (
                                <button onClick={() => setShowAddressForm(true)}
                                    className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-accent transition-colors font-semibold">
                                    <Plus className="w-3.5 h-3.5" /> Add New
                                </button>
                            )}
                        </div>

                        {showAddressForm && <AddressForm onDone={() => setShowAddressForm(false)} />}

                        {addresses.length === 0 && !showAddressForm ? (
                            <EmptyState icon={MapPin} text="No saved addresses yet" />
                        ) : (
                            <div className="space-y-2.5">
                                {addresses.map((a: any) => {
                                    const Icon = labelIcons[a.label] || MapPin;
                                    return (
                                        <div key={a._id} className="flex items-start gap-3 bg-charcoal-800 rounded-2xl p-4 border border-white/5">
                                            <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <Icon className="w-4 h-4 text-brand-blue" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-white">{a.label}</p>
                                                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{a.address}</p>
                                                {a.apartmentName && <p className="text-xs text-zinc-500">{a.apartmentName}</p>}
                                                {a.mobile && <p className="text-xs text-zinc-500 mt-0.5">📞 +91 {a.mobile}</p>}
                                            </div>
                                            <button onClick={() => confirmDelete(a._id, "address")}
                                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* ──── Vehicles ──── */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <Car className="w-4 h-4 text-brand-blue" /> Vehicles
                                <span className="text-xs font-normal text-zinc-500 ml-1">({vehicles.length})</span>
                            </h2>
                            {!showVehicleForm && (
                                <button onClick={() => setShowVehicleForm(true)}
                                    className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-accent transition-colors font-semibold">
                                    <Plus className="w-3.5 h-3.5" /> Add New
                                </button>
                            )}
                        </div>

                        {showVehicleForm && <VehicleForm onDone={() => setShowVehicleForm(false)} />}

                        {vehicles.length === 0 && !showVehicleForm ? (
                            <EmptyState icon={Car} text="No saved vehicles yet" />
                        ) : (
                            <div className="grid grid-cols-1 gap-2.5">
                                {vehicles.map((v: any) => (
                                    <div key={v._id} className="flex items-center gap-3 bg-charcoal-800 rounded-2xl px-4 py-3.5 border border-white/5">
                                        <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                                            {vehicleTypeIcon(v.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-sm uppercase tracking-wide text-white">{v.number}</p>
                                                <span className="text-[10px] px-1.5 py-0.5 bg-brand-blue/10 text-brand-blue rounded font-medium">{v.type}</span>
                                                {v.label && <span className="text-[10px] text-zinc-500">{v.label}</span>}
                                            </div>
                                            {v.model && <p className="text-xs text-zinc-400 mt-0.5">{v.model}</p>}
                                        </div>
                                        <button onClick={() => confirmDelete(v._id, "vehicle")}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center p-4 sm:items-center">
                    <div className="w-full max-w-sm bg-charcoal-800 rounded-2xl border border-white/10 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-white">Remove {confirmDeleteType === "address" ? "Address" : "Vehicle"}?</p>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-zinc-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-400">This will be permanently removed from your saved list.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-zinc-300 font-medium transition-colors">
                                Cancel
                            </button>
                            <button onClick={doDelete} disabled={deletingAddr || deletingVeh}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-sm font-bold text-white transition-colors">
                                {(deletingAddr || deletingVeh) ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function EmptyState({ icon: Icon, text }: { icon: any; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-zinc-600">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                <Icon className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-sm">{text}</p>
        </div>
    );
}
