import { useState, useEffect } from "react";
import { Drawer } from "../../../components/shared/Drawer";
import { Button } from "../../../components/shared/Button";
import { useServices } from "../../services/hooks";
import { useUpdateBookingServices } from "../hooks";

interface EditServicesSheetProps {
    open: boolean;
    onClose: () => void;
    bookingId: string;
    initialVehicles: any[];
}

export const EditServicesSheet = ({ open, onClose, bookingId, initialVehicles }: EditServicesSheetProps) => {
    const { data: servicesData } = useServices();
    const services = servicesData?.data || [];
    
    const updateMutation = useUpdateBookingServices();

    const [vehicles, setVehicles] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            setVehicles(initialVehicles.map((v, i) => ({
                id: i,
                type: v.type || "4W",
                number: v.number || "",
                model: v.model || "",
                cc: v.cc || "",
                serviceId: v.serviceId?._id || v.serviceId || "",
                addons: v.addons?.map((a: any) => a._id || a) || []
            })));
        }
    }, [open, initialVehicles]);

    const updateVehicle = (id: number, field: string, value: any) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === id) {
                const newV = { ...v, [field]: value };
                if (field === "type") {
                    newV.serviceId = "";
                    newV.addons = [];
                } else if (field === "serviceId" && v.serviceId !== value) {
                    newV.addons = []; // Clear addons when service changes
                }
                return newV;
            }
            return v;
        }));
    };

    const addVehicle = () => {
        setVehicles(prev => [
            ...prev,
            { id: Date.now(), type: "4W", number: "", model: "", cc: "", serviceId: "", addons: [] }
        ]);
    };

    const removeVehicle = (id: number) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            bookingId,
            vehicles: vehicles.map(v => ({
                type: v.type,
                number: v.number,
                model: v.model,
                cc: v.cc,
                serviceId: v.serviceId,
                addons: v.addons
            }))
        };

        updateMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
            },
            onError: (err: any) => {
                alert(err?.response?.data?.message || "Error updating services");
            }
        });
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="flex flex-col h-full max-h-[85vh]">
                <h2 className="text-xl font-bold mb-4">Edit Services</h2>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <h3 className="font-semibold text-zinc-300">Vehicles</h3>
                            <button type="button" onClick={addVehicle} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Vehicle</button>
                        </div>

                        {vehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className="p-3 bg-zinc-800/50 rounded-lg space-y-3 relative">
                                {vehicles.length > 1 && (
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
                                        {services.filter((s: any) => s.vehicleType === vehicle.type).map((s: any) => (
                                            <option key={s._id} value={s._id}>{s.name} (₹{s.price})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 pb-4 bg-zinc-950 absolute bottom-0 left-0 right-0 px-4">
                        <Button type="submit" loading={updateMutation.isPending} className="w-full">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    );
};
