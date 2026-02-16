import { Card } from "../../../components/shared/Card";
import { Badge } from "../../../components/shared/Badge";
import type { User } from "../types";
import { Pencil, Power, Mail, Phone, Shield } from "lucide-react";

interface Props {
    user: User;
    onEdit: () => void;
    onToggle: () => void;
    disableToggle?: boolean;
}

export const UserCard: React.FC<Props> = ({
    user,
    onEdit,
    onToggle,
    disableToggle,
}) => {
    return (
        <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm shadow-black/20 active:scale-[0.98] transition-all duration-150">

            {/* TOP ROW */}
            <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-zinc-100 leading-tight">
                    {user.name}
                </p>

                <Badge
                    variant={user.isActive ? "success" : "default"}
                    className="px-2 py-1 text-xs rounded-full font-medium"
                >
                    {user.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
            </div>

            {/* MOBILE */}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone className="w-3.5 h-3.5" />
                {user.mobile}
            </div>

            {/* ROLE BADGE */}
            <div>
                <span className="px-2 py-1 text-xs rounded-full font-medium bg-sky-500/15 text-sky-400 flex items-center gap-1 w-fit">
                    <Shield className="w-3 h-3" />
                    {user.role}
                </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-1">

                <button
                    onClick={onEdit}
                    className="flex-1 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150"
                >
                    <Pencil className="w-4 h-4" />
                    Edit
                </button>

                {!disableToggle && (
                    <button
                        onClick={onToggle}
                        className={`flex-1 h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 ${user.isActive
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                    >
                        <Power className="w-4 h-4" />
                        {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                )}

            </div>
        </Card>
    );
};
