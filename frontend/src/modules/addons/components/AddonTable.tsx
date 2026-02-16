import type { Addon } from "../types";
import { Pencil, Power } from "lucide-react";

interface Props {
    data: Addon[];
    onEdit: (a: Addon) => void;
    onToggle: (a: Addon) => void;
}

export const AddonTable: React.FC<Props> = ({
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
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Type</th>
                            <th className="text-left p-3 font-medium">Price</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {data.map((a) => (
                            <tr
                                key={a._id}
                                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-all duration-150"
                            >
                                {/* NAME */}
                                <td className="p-3 font-medium text-zinc-100">
                                    {a.name}
                                </td>

                                {/* TYPE BADGE */}
                                <td className="p-3">
                                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-sky-500/15 text-sky-400">
                                        {a.vehicleType}
                                    </span>
                                </td>

                                {/* PRICE */}
                                <td className="p-3 font-semibold text-zinc-100">
                                    ₹ {a.price}
                                </td>

                                {/* STATUS BADGE */}
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full font-medium ${a.isActive
                                            ? "bg-emerald-500/15 text-emerald-400"
                                            : "bg-red-500/15 text-red-400"
                                            }`}
                                    >
                                        {a.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(a)}
                                            className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                        >
                                            <Pencil className="w-4 h-4 text-zinc-300" />
                                        </button>

                                        <button
                                            onClick={() => onToggle(a)}
                                            className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                        >
                                            <Power
                                                className={`w-4 h-4 ${a.isActive
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
