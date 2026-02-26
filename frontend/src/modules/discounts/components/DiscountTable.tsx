import type { Discount } from "../types";
import { Pencil, Power, Percent, CircleDollarSign } from "lucide-react";

interface Props {
    data: Discount[];
    onEdit: (d: Discount) => void;
    onToggle: (d: Discount) => void;
}

export const DiscountTable: React.FC<Props> = ({
    data,
    onEdit,
    onToggle,
}) => {
    return (
        <div className="hidden lg:block">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm shadow-black/20 overflow-x-auto">
                <table className="w-full text-sm">

                    {/* HEADER */}
                    <thead className="text-zinc-400 sticky top-0 bg-zinc-900 z-10">
                        <tr className="border-b border-zinc-800">
                            <th className="text-left p-3 font-medium">Code</th>
                            <th className="text-left p-3 font-medium">Value</th>
                            <th className="text-left p-3 font-medium">Min Order</th>
                            <th className="text-left p-3 font-medium">Usage</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {data.map((d) => (
                            <tr
                                key={d._id}
                                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-all duration-150"
                            >
                                <td className="p-3 font-bold text-emerald-400 uppercase tracking-wider">
                                    {d.code}
                                </td>

                                <td className="p-3 font-medium text-zinc-100 flex items-center gap-1.5 h-[53px]">
                                    {d.type === "percentage" ? (
                                        <><Percent className="w-3.5 h-3.5 text-zinc-400" /> {d.value}%</>
                                    ) : (
                                        <><CircleDollarSign className="w-3.5 h-3.5 text-zinc-400" /> ₹{d.value}</>
                                    )}
                                </td>

                                <td className="p-3 text-zinc-400">
                                    {d.minOrderValue > 0 ? `₹${d.minOrderValue}` : 'None'}
                                </td>

                                <td className="p-3">
                                    <span className="text-zinc-300">
                                        {d.usedCount} <span className="text-zinc-500">/ {d.usageLimit > 0 ? d.usageLimit : '∞'}</span>
                                    </span>
                                </td>

                                {/* STATUS BADGE */}
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full font-medium ${d.isActive
                                            ? "bg-emerald-500/15 text-emerald-400"
                                            : "bg-red-500/15 text-red-400"
                                            }`}
                                    >
                                        {d.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(d)}
                                            className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                        >
                                            <Pencil className="w-4 h-4 text-zinc-300" />
                                        </button>

                                        <button
                                            onClick={() => onToggle(d)}
                                            className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                        >
                                            <Power
                                                className={`w-4 h-4 ${d.isActive
                                                    ? "text-red-400"
                                                    : "text-emerald-400"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
