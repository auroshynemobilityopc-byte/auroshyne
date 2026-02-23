import { useState } from "react";
import { Drawer } from "../../../components/shared/Drawer";
import { Button } from "../../../components/shared/Button";
import { useCreateBooking } from "../hooks";
import { useServices } from "../../services/hooks";

interface AddBookingSheetProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddBookingSheet = ({ open, onClose, onSuccess }: AddBookingSheetProps) => {
    const createMutation = useCreateBooking();
    const { data: servicesData } = useServices();
    const services = servicesData?.data || [];

    // Simple state holding the booking form data
    const [formData, setFormData] = useState({
        customerName: "",
        customerMobile: "",
        customerAddress: "",
        apartmentName: "",
        category: "private",
        paymentMode: "cash",
        date: new Date().toISOString().split("T")[0],
        slot: "MORNING",
        vehicles: [
            { id: Date.now(), type: "4W", number: "", model: "", cc: "", serviceId: "", addonIds: [] }
        ]
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateVehicle = (id: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.map(v => v.id === id ? { ...v, [field]: value } : v)
        }));
    };

    const addVehicle = () => {
        setFormData(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, { id: Date.now(), type: "4W", number: "", model: "", cc: "", serviceId: "", addonIds: [] }]
        }));
    };

    const removeVehicle = (id: number) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.filter(v => v.id !== id)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            customer: {
                name: formData.customerName,
                mobile: formData.customerMobile,
                address: formData.customerAddress,
                apartmentName: formData.apartmentName || ""
            },
            category: formData.category,
            paymentMode: formData.paymentMode,
            slot: formData.slot.toUpperCase(),
            date: formData.date,
            vehicles: formData.vehicles.map(v => ({
                type: v.type, // '2W' | '4W' | 'CAB'
                number: v.number,
                model: v.model,
                cc: v.cc,
                serviceId: v.serviceId, // we need dummy or actual serviceId
                addons: []
            }))
        };

        createMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
            onError: (err: any) => {
                alert(err?.response?.data?.message || "Error creating booking");
            }
        });
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="flex flex-col h-full max-h-[85vh]">
                <h2 className="text-xl font-bold mb-4">Add Booking</h2>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Customer Details</h3>
                        <input
                            required
                            placeholder="Name"
                            value={formData.customerName}
                            onChange={e => handleChange("customerName", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                            required
                            placeholder="Mobile (e.g. 9876543210)"
                            value={formData.customerMobile}
                            onChange={e => handleChange("customerMobile", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                            required
                            placeholder="Full Address"
                            value={formData.customerAddress}
                            onChange={e => handleChange("customerAddress", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                            placeholder="Apartment/Building Name (Optional)"
                            value={formData.apartmentName}
                            onChange={e => handleChange("apartmentName", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-zinc-300 border-b border-zinc-800 pb-2 mt-6">Booking Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => handleChange("category", e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="private">Private</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Payment Mode</label>
                                <select
                                    value={formData.paymentMode}
                                    onChange={e => handleChange("paymentMode", e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="online">Online</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => handleChange("date", e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Slot</label>
                                <select
                                    value={formData.slot}
                                    onChange={e => handleChange("slot", e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="MORNING">Morning (9 AM - 1 PM)</option>
                                    <option value="AFTERNOON">Afternoon (1 PM - 5 PM)</option>
                                    <option value="EVENING">Evening (5 PM - 9 PM)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mt-6">
                            <h3 className="font-semibold text-zinc-300">Vehicles</h3>
                            <button type="button" onClick={addVehicle} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Vehicle</button>
                        </div>

                        {formData.vehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className="p-3 bg-zinc-800/50 rounded-lg space-y-3 relative">
                                {formData.vehicles.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeVehicle(vehicle.id)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-xs"
                                    >
                                        Remove
                                    </button>
                                )}
                                <p className="text-sm font-medium">Vehicle #{index + 1}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={vehicle.type}
                                        onChange={e => updateVehicle(vehicle.id, "type", e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
                                    >
                                        <option value="4W">4W</option>
                                        <option value="2W">2W</option>
                                        <option value="CAB">CAB</option>
                                    </select>
                                    <input
                                        required
                                        placeholder="Reg Number"
                                        value={vehicle.number}
                                        onChange={e => updateVehicle(vehicle.id, "number", e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm uppercase"
                                    />
                                    <input
                                        placeholder="Model"
                                        value={vehicle.model}
                                        onChange={e => updateVehicle(vehicle.id, "model", e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
                                    />
                                    <input
                                        placeholder="CC"
                                        value={vehicle.cc}
                                        onChange={e => updateVehicle(vehicle.id, "cc", e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
                                    />
                                    <select
                                        required
                                        value={vehicle.serviceId}
                                        onChange={e => updateVehicle(vehicle.id, "serviceId", e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm col-span-2"
                                    >
                                        <option value="" disabled>Select a Service</option>
                                        {services.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} ({s.vehicleType})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 pb-4 bg-zinc-950 absolute bottom-0 left-0 right-0 px-4">
                        <Button type="submit" loading={createMutation.isPending} className="w-full">
                            Create Booking
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    );
};
