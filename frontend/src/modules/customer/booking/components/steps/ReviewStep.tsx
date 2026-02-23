import { Check, CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { SLOTS } from "../../../lib/utils";
import type { StepProps } from "../../types";

export default function ReviewStep({ booking, services = [], addons = [], totalEstimate = 0 }: StepProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Review Booking</h2>

            <div className="bg-charcoal-800 rounded-2xl p-6 border border-white/10 space-y-6">
                {booking.vehicles.map((v, i) => {
                    const service = services.find((s: any) => s._id === v.serviceId);
                    const servicePrice = service?.price || 0;

                    return (
                        <div key={v.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-base text-brand-blue">
                                        {v.number || `Vehicle ${i + 1}`} <span className="text-xs text-text-grey font-normal">({v.type})</span>
                                    </h3>
                                    <p className="text-sm font-medium">{service?.name || 'No Service Selected'}</p>
                                </div>
                                <span className="font-bold">₹{servicePrice}</span>
                            </div>

                            {v.addonIds && v.addonIds.length > 0 && (
                                <div className="pl-4 border-l-2 border-white/10 mt-2 space-y-1">
                                    {v.addonIds.map(id => {
                                        const addon = addons.find((a: any) => a._id === id);
                                        return (
                                            <div key={id} className="flex justify-between text-xs text-text-grey">
                                                <span>+ {addon?.name}</span>
                                                <span>₹{addon?.price}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="font-bold text-2xl text-brand-blue">₹{totalEstimate}</span>
                </div>
            </div>

            <div className="bg-brand-blue/10 rounded-xl p-4 border border-brand-blue/20 flex items-start gap-3">
                <div className="p-2 bg-brand-blue rounded-full">
                    <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-brand-blue text-sm">You are saving money!</h4>
                    <p className="text-xs text-text-grey mt-1">Package pricing includes a discount compared to individual services.</p>
                </div>
            </div>

            <div className="space-y-2 text-sm text-text-grey">
                <div className="flex gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{booking.date ? format(booking.date, 'dd MMM yyyy') : ''} • {SLOTS.find(s => s.id === booking.slotId)?.label}</span>
                </div>
                <div className="flex gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.address.house}, {booking.address.street}</span>
                </div>
            </div>
        </div>
    );
}
