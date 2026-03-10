import { format } from "date-fns";
import type { StepProps } from "../types";
import { useSettings } from "../../../settings/hooks";

export default function BookingSummary({ booking, services = [], totalEstimate = 0, bulkDiscount = 0, step = 1 }: StepProps) {
    const { data: settingsData } = useSettings();
    const taxPercentage = settingsData?.data?.taxPercentage || 0;
    const twoVehiclesDiscount = settingsData?.data?.bulkDiscount?.twoVehicles ?? 5;
    const threeOrMoreVehiclesDiscount = settingsData?.data?.bulkDiscount?.threeOrMoreVehicles ?? 10;

    const effectiveDiscount = Math.max(booking.discountValue || 0, bulkDiscount || 0);
    const isBulkDiscountApplied = effectiveDiscount === bulkDiscount && bulkDiscount > 0;
    const discountLabel = isBulkDiscountApplied
        ? `Bulk Booking (${booking.vehicles.length >= 3 ? `${threeOrMoreVehiclesDiscount}%` : `${twoVehiclesDiscount}%`})`
        : (booking.discountCode || 'Discount');

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

                <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-text-grey">Subtotal</span>
                        <span className="font-medium">₹{totalEstimate}</span>
                    </div>

                    {effectiveDiscount > 0 && (
                        <div className="flex justify-between items-center text-emerald-400">
                            <span className="font-medium flex items-center gap-1">
                                Discount <span className="text-xs px-2 py-0.5 bg-emerald-500/10 rounded-full font-bold uppercase">{discountLabel}</span>
                            </span>
                            <span className="font-bold">- ₹{effectiveDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    {step >= 7 && taxPercentage > 0 && (
                        <div className="flex justify-between items-center text-text-grey">
                            <span>Tax ({taxPercentage}%)</span>
                            <span>+ ₹{((totalEstimate - effectiveDiscount) * (taxPercentage / 100)).toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <span className="font-bold text-lg text-white">
                            {step >= 7 && taxPercentage > 0 ? 'Amount to Pay' : 'Final Total'}
                        </span>
                        <span className="font-bold text-xl text-brand-blue">
                            ₹{step >= 7 && taxPercentage > 0
                                ? ((totalEstimate - effectiveDiscount) * (1 + taxPercentage / 100)).toFixed(2)
                                : (totalEstimate - effectiveDiscount).toFixed(2).replace(/\.00$/, '')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
