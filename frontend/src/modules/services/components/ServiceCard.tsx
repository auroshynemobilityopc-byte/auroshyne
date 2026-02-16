import { Card } from "../../../components/shared/Card";
import { Badge } from "../../../components/shared/Badge";
import type { Service } from "../types";
import { Pencil, Power } from "lucide-react";

interface Props {
    service: Service;
    onEdit: () => void;
    onToggle: () => void;
}

export const ServiceCard: React.FC<Props> = ({
    service,
    onEdit,
    onToggle,
}) => {
    return (
        <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm shadow-black/20 active:scale-[0.98] transition-all duration-150">

            {/* TOP ROW */}
            <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-zinc-100 leading-tight">
                    {service.name}
                </p>

                <Badge
                    variant={service.isActive ? "success" : "default"}
                    className="px-2 py-1 text-xs rounded-full font-medium"
                >
                    {service.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>

            {/* VEHICLE + PRICE ROW */}
            <div className="flex items-center justify-between">

                <span className="px-2 py-1 text-xs rounded-full font-medium bg-sky-500/15 text-sky-400">
                    {service.vehicleType}
                </span>

                <span className="text-base font-semibold text-zinc-100">
                    ₹ {service.price}
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

                <button
                    onClick={onToggle}
                    className={`flex-1 h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 ${service.isActive
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                >
                    <Power className="w-4 h-4" />
                    {service.isActive ? "Deactivate" : "Activate"}
                </button>

            </div>
        </Card>
    );
};
