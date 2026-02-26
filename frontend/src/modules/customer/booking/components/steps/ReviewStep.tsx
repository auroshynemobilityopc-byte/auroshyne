import { useState } from "react";
import { Check, CalendarIcon, MapPin, Loader2, X, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { SLOTS } from "../../../lib/utils";
import type { StepProps } from "../../types";
import { validateDiscount } from "../../api";

export default function ReviewStep({ booking, updateBooking, services = [], addons = [], totalEstimate = 0 }: StepProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApply = async () => {
        if (!code.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await validateDiscount({ code: code.trim().toUpperCase(), orderValue: totalEstimate });
            const discountData = res.data;

            let amount = 0;
            if (discountData.type === 'percentage') {
                amount = totalEstimate * (discountData.value / 100);
            } else {
                amount = discountData.value;
            }

            if (discountData.maxDiscount && amount > discountData.maxDiscount) {
                amount = discountData.maxDiscount;
            }

            updateBooking({
                discountCode: discountData.code,
                discountValue: amount
            });
            setCode("");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid coupon code");
            updateBooking({ discountCode: null, discountValue: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        updateBooking({ discountCode: null, discountValue: 0 });
        setError(null);
    };
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

                <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-sm text-text-grey">
                        <span>Subtotal</span>
                        <span>₹{totalEstimate}</span>
                    </div>
                    {booking.discountValue > 0 && (
                        <div className="flex justify-between items-center text-sm text-emerald-400 font-medium">
                            <span>Discount {booking.discountCode ? `(${booking.discountCode})` : ''}</span>
                            <span>- ₹{booking.discountValue.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-lg">Amount to Pay</span>
                        <span className="font-bold text-2xl text-brand-blue">₹{(totalEstimate - (booking.discountValue || 0)).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-bold block">Have a Coupon?</label>

                {booking.discountCode ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <div>
                                <span className="font-bold uppercase block">{booking.discountCode}</span>
                                <span className="text-xs">₹{booking.discountValue.toFixed(2)} saved</span>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-400/80 hover:text-emerald-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                                className="flex-1 bg-charcoal-800 border border-white/10 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none uppercase placeholder:normal-case"
                            />
                            <button
                                onClick={handleApply}
                                disabled={loading || !code.trim()}
                                className="px-5 py-2 min-w-[90px] bg-brand-blue hover:bg-brand-accent disabled:opacity-50 disabled:hover:bg-brand-blue rounded-xl font-medium transition-colors flex items-center justify-center text-white"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-sm pl-1">{error}</p>}
                    </div>
                )}
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
