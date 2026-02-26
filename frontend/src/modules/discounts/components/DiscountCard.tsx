import { Card } from "../../../components/shared/Card";
import { Badge } from "../../../components/shared/Badge";
import type { Discount } from "../types";
import { Pencil, Power, Percent, CircleDollarSign, CalendarDays } from "lucide-react";

interface Props {
    discount: Discount;
    onEdit: () => void;
    onToggle: () => void;
}

export const DiscountCard: React.FC<Props> = ({
    discount,
    onEdit,
    onToggle,
}) => {
    return (
        <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm shadow-black/20 active:scale-[0.98] transition-all duration-150">
            {/* TOP ROW */}
            <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-lg text-emerald-400 leading-tight uppercase tracking-wider">
                    {discount.code}
                </p>

                <Badge
                    variant={discount.isActive ? "success" : "default"}
                    className="px-2 py-1 text-xs rounded-full font-medium"
                >
                    {discount.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>

            {/* VALUE / DESC */}
            <div className="flex items-center gap-2 text-sm text-zinc-100 font-medium h-5">
                {discount.type === "percentage" ? (
                    <><Percent className="w-3.5 h-3.5 text-zinc-400" /> {discount.value}% OFF</>
                ) : (
                    <><CircleDollarSign className="w-3.5 h-3.5 text-zinc-400" /> ₹{discount.value} OFF</>
                )}
            </div>

            {discount.description && (
                <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {discount.description}
                </div>
            )}

            {/* STATS BADGE */}
            <div className="flex flex-wrap gap-2 mt-1">
                {discount.minOrderValue > 0 && (
                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-zinc-800/80 text-zinc-300 flex items-center gap-1 w-fit">
                        Min Order: ₹{discount.minOrderValue}
                    </span>
                )}
                <span className="px-2 py-1 text-xs rounded-full font-medium bg-amber-500/10 text-amber-400 flex items-center gap-1 w-fit">
                    <CalendarDays className="w-3 h-3" />
                    Uses: {discount.usedCount} {discount.usageLimit > 0 ? `/ ${discount.usageLimit}` : '(Unlimited)'}
                </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-1">
                <button
                    onClick={onEdit}
                    className="flex-[0.3] h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150"
                >
                    <Pencil className="w-4 h-4" />
                </button>

                <button
                    onClick={onToggle}
                    className={`flex-1 h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 ${discount.isActive
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                >
                    <Power className="w-4 h-4" />
                    {discount.isActive ? "Deactivate" : "Activate"}
                </button>
            </div>
        </Card>
    );
};
