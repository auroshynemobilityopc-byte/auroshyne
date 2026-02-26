import { cn } from "../../../lib/utils";
import type { StepProps } from "../../types";

export default function PaymentStep({ booking, updateBooking }: StepProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Select Payment Mode</h2>
            <div className="space-y-3">
                {[
                    { id: 'online', label: 'Online Payment', sub: 'Credit/Debit Card, Netbanking' },
                    { id: 'upi', label: 'UPI', sub: 'GPay, PhonePe, Paytm' },
                    { id: 'cash', label: 'Cash after service', sub: 'Pay to technician' }
                ].map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => updateBooking({ paymentMode: mode.id as any })}
                        className={cn(
                            "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                            booking.paymentMode === mode.id ? "border-brand-blue bg-brand-blue/10" : "bg-charcoal-800 border-white/10 hover:border-white/20"
                        )}
                    >
                        <div className="text-left">
                            <span className="font-medium block">{mode.label}</span>
                            <span className="text-xs text-text-grey">{mode.sub}</span>
                        </div>
                        {booking.paymentMode === mode.id && <div className="w-4 h-4 rounded-full bg-brand-blue" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
