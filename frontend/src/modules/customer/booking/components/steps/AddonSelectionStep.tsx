import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { StepProps, VehicleType } from "../../types";

export default function AddonSelectionStep({ booking, updateBooking, addons = [], loadingAddons }: StepProps) {
    const mapVehicleType = (type: VehicleType) => type === 'two-wheeler' ? '2W' : type === 'four-wheeler' ? '4W' : 'CAB';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Add-ons (Optional)</h2>
                    <span className="text-sm text-text-grey">Select multiple</span>
                </div>
                {booking.isBulkBooking && booking.vehicles.length > 1 && (
                    <button
                        onClick={() => {
                            const firstVehicleAddons = booking.vehicles[0].addonIds || [];
                            if (firstVehicleAddons.length > 0) {
                                const newVehicles = booking.vehicles.map(v => ({ ...v, addonIds: [...firstVehicleAddons] }));
                                updateBooking({ vehicles: newVehicles });
                            }
                        }}
                        className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg hover:bg-brand-blue/20 transition-colors"
                    >
                        Apply First to All
                    </button>
                )}
            </div>

            <div className="space-y-8">
                {booking.vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="space-y-3">
                        {booking.isBulkBooking && (
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <h3 className="font-bold text-sm text-brand-blue">
                                    Vehicle {index + 1}: {vehicle.number || 'Unknown'}
                                </h3>
                                {index > 0 && (
                                    <button
                                        onClick={() => {
                                            const prevVehicle = booking.vehicles[index - 1];
                                            if (prevVehicle.addonIds) {
                                                const newVehicles = booking.vehicles.map(v =>
                                                    v.id === vehicle.id ? { ...v, addonIds: [...(prevVehicle.addonIds || [])] } : v
                                                );
                                                updateBooking({ vehicles: newVehicles });
                                            }
                                        }}
                                        className="text-[10px] text-text-grey hover:text-white flex items-center gap-1"
                                    >
                                        Copy from Vehicle {index}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            {loadingAddons && <div className="text-sm text-text-grey p-4">Loading addons...</div>}
                            {addons.filter((a: any) => a.vehicleType === mapVehicleType(vehicle.type)).map((addon: any) => {
                                const currentAddons = vehicle.addonIds || [];
                                const isSelected = currentAddons.includes(addon._id);
                                return (
                                    <button
                                        key={addon._id}
                                        onClick={() => {
                                            const newIds = isSelected
                                                ? currentAddons.filter(id => id !== addon._id)
                                                : [...currentAddons, addon._id];

                                            const newVehicles = booking.vehicles.map(v =>
                                                v.id === vehicle.id ? { ...v, addonIds: newIds } : v
                                            );
                                            updateBooking({ vehicles: newVehicles });
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border bg-charcoal-800 transition-all",
                                            isSelected ? "border-brand-blue bg-brand-blue/10" : "border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <div className="text-left">
                                            <h3 className="font-medium">{addon.name}</h3>
                                            {addon.description && <p className="text-xs text-text-grey">{addon.description}</p>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-brand-blue">₹{addon.price}</span>
                                            <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                                                isSelected ? "bg-brand-blue border-brand-blue" : "border-white/30")}>
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
