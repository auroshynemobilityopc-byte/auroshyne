import type { User } from "../types";
import { Pencil, Power } from "lucide-react";

interface Props {
    data: User[];
    onEdit: (u: User) => void;
    onToggle: (u: User) => void;
    currentUserId?: string;
}

export const UserTable: React.FC<Props> = ({
    data,
    onEdit,
    onToggle,
    currentUserId,
}) => {
    return (
        <div className="hidden lg:block">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm shadow-black/20 overflow-x-auto">
                <table className="w-full text-sm">

                    {/* HEADER */}
                    <thead className="text-zinc-400 sticky top-0 bg-zinc-900 z-10">
                        <tr className="border-b border-zinc-800">
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Email</th>
                            <th className="text-left p-3 font-medium">Mobile</th>
                            <th className="text-left p-3 font-medium">Role</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {data.map((u) => (
                            <tr
                                key={u._id}
                                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-all duration-150"
                            >
                                <td className="p-3 font-medium text-zinc-100">
                                    {u.name}
                                </td>

                                <td className="p-3 text-zinc-400">
                                    {u.email}
                                </td>

                                <td className="p-3 text-zinc-400">
                                    {u.mobile}
                                </td>

                                {/* ROLE BADGE */}
                                <td className="p-3">
                                    <span className="px-2 py-1 text-xs rounded-full bg-sky-500/15 text-sky-400 font-medium">
                                        {u.role}
                                    </span>
                                </td>

                                {/* STATUS BADGE */}
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full font-medium ${u.isActive
                                            ? "bg-emerald-500/15 text-emerald-400"
                                            : "bg-red-500/15 text-red-400"
                                            }`}
                                    >
                                        {u.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(u)}
                                            className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                        >
                                            <Pencil className="w-4 h-4 text-zinc-300" />
                                        </button>

                                        {u._id !== currentUserId && (
                                            <button
                                                onClick={() => onToggle(u)}
                                                className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-150"
                                            >
                                                <Power
                                                    className={`w-4 h-4 ${u.isActive
                                                        ? "text-red-400"
                                                        : "text-emerald-400"
                                                        }`}
                                                />
                                            </button>
                                        )}
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
