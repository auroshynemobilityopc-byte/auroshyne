import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { StepProps, VehicleType } from "../../types";

export default function ServiceSelectionStep({ booking, updateBooking, services = [], loadingServices }: StepProps) {
    const mapVehicleType = (type: VehicleType) => type === 'two-wheeler' ? '2W' : type === 'four-wheeler' ? '4W' : 'CAB';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Select Service</h2>
                {booking.isBulkBooking && booking.vehicles.length > 1 && (
                    <button
                        onClick={() => {
                            const firstVehicleService = booking.vehicles[0].serviceId;
                            if (firstVehicleService) {
                                const newVehicles = booking.vehicles.map(v => ({ ...v, serviceId: firstVehicleService }));
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
                                    Vehicle {index + 1}: {vehicle.number || 'Unknown'} ({vehicle.type === 'two-wheeler' ? '2W' : '4W'})
                                </h3>
                                {index > 0 && (
                                    <button
                                        onClick={() => {
                                            const prevVehicle = booking.vehicles[index - 1];
                                            if (prevVehicle.serviceId) {
                                                const newVehicles = booking.vehicles.map(v =>
                                                    v.id === vehicle.id ? { ...v, serviceId: prevVehicle.serviceId } : v
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
                            {loadingServices && <div className="text-sm text-text-grey p-4">Loading services...</div>}
                            {services.filter((s: any) => s.vehicleType === mapVehicleType(vehicle.type)).map((service: any) => {
                                const isSelected = vehicle.serviceId === service._id;

                                return (
                                    <button
                                        key={service._id}
                                        onClick={() => {
                                            const newVehicles = booking.vehicles.map(v =>
                                                v.id === vehicle.id ? { ...v, serviceId: service._id } : v
                                            );
                                            updateBooking({ vehicles: newVehicles });
                                        }}
                                        className={cn(
                                            "w-full text-left p-4 rounded-xl border bg-charcoal-800 transition-all relative overflow-hidden group",
                                            isSelected ? "border-brand-blue bg-brand-blue/5" : "border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-base">{service.name}</h3>
                                            <span className="font-bold text-brand-blue">₹{service.price}</span>
                                        </div>
                                        <p className="text-xs text-text-grey leading-relaxed line-clamp-2">{service.description}</p>
                                        {isSelected && (
                                            <div className="absolute top-0 right-0 p-1.5 bg-brand-blue rounded-bl-lg">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
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
