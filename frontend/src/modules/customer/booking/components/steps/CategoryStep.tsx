import { motion } from "motion/react";
import { Car, Bike, Truck, Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { StepProps, VehicleCategory, VehicleType, Vehicle } from "../../types";

export default function CategoryStep({ booking, updateBooking }: StepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-4">Select Vehicle Category</h2>
                <div className="grid grid-cols-2 gap-4">
                    {['private', 'commercial'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => updateBooking({ category: cat as VehicleCategory })}
                            className={cn(
                                "p-4 rounded-2xl border border-white/10 bg-charcoal-800 flex flex-col items-center gap-2 transition-all",
                                booking.category === cat ? "border-brand-blue bg-brand-blue/10 ring-1 ring-brand-blue" : "hover:bg-charcoal-800/80"
                            )}
                        >
                            <Car className={cn("w-8 h-8", booking.category === cat ? "text-brand-blue" : "text-text-grey")} />
                            <span className="capitalize font-medium">{cat} Vehicle</span>
                        </button>
                    ))}
                </div>
            </div>

            {booking.category && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-xl font-bold mb-4">Select Vehicle Type</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'two-wheeler', label: 'Two Wheeler', icon: Bike },
                            { id: 'four-wheeler', label: 'Four Wheeler', icon: Car },
                            { id: 'cab', label: 'Cab (Commercial)', icon: Truck, hidden: booking.category === 'private' }
                        ].filter(t => !t.hidden).map((type) => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    const initialVehicle: Vehicle = {
                                        id: Math.random().toString(36).substr(2, 9),
                                        number: "",
                                        model: "",
                                        cc: "",
                                        type: type.id as VehicleType,
                                        image: null
                                    };
                                    updateBooking({
                                        type: type.id as VehicleType,
                                        vehicles: [initialVehicle]
                                    });
                                }}
                                className={cn(
                                    "p-4 rounded-xl border border-white/10 bg-charcoal-800 flex items-center justify-between transition-all",
                                    booking.type === type.id ? "border-brand-blue bg-brand-blue/10" : "hover:bg-charcoal-800/80"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-lg", booking.type === type.id ? "bg-brand-blue text-white" : "bg-white/5 text-text-grey")}>
                                        <type.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">{type.label}</span>
                                </div>
                                {booking.type === type.id && <Check className="w-5 h-5 text-brand-blue" />}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
