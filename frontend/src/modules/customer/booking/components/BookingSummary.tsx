import { format } from "date-fns";
import type { StepProps } from "../types";

export default function BookingSummary({ booking, services = [], totalEstimate = 0 }: StepProps) {
    return (
        <div className="hidden md:block md:col-span-4">
            <div className="sticky top-24 bg-charcoal-800 rounded-2xl p-6 border border-white/5 shadow-xl">
                <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-4">Booking Summary</h3>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-text-grey">Category</span>
                        <span className="font-medium capitalize">{booking.category || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-grey">Type</span>
                        <span className="font-medium capitalize">{booking.type?.replace('-', ' ') || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-grey">Vehicles</span>
                        <span className="font-medium uppercase">{booking.vehicles.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-grey">Services</span>
                        <span className="font-medium text-right max-w-[150px] truncate">
                            {booking.vehicles.length > 0 && booking.vehicles.every(v => v.serviceId === booking.vehicles[0].serviceId)
                                ? (services.find((s: any) => s._id === booking.vehicles[0].serviceId)?.name || '-')
                                : (booking.vehicles.length > 0 ? 'Mixed Selection' : '-')}
                        </span>
                    </div>
                    {booking.vehicles.reduce((acc, v) => acc + (v.addonIds?.length || 0), 0) > 0 && (
                        <div className="flex justify-between">
                            <span className="text-text-grey">Add-ons</span>
                            <span className="font-medium">{booking.vehicles.reduce((acc, v) => acc + (v.addonIds?.length || 0), 0)} selected</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-text-grey">Date</span>
                        <span className="font-medium">{booking.date ? format(booking.date, 'dd MMM') : '-'}</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Total Estimate</span>
                        <span className="font-bold text-xl text-brand-blue">₹{totalEstimate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
