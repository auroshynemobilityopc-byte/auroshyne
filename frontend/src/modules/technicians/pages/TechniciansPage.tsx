import { useState } from "react";
import {
    useTechnicians,
    useCreateTechnician,
    useUpdateTechnician,
} from "../hooks";
import { TechnicianCard } from "../components/TechnicianCard";
import { TechnicianTable } from "../components/TechnicianTable";
import { TechnicianFormDrawer } from "../components/TechnicianFormDrawer";
import { Button } from "../../../components/shared/Button";
import { Users, Plus } from "lucide-react";

export const TechniciansPage = () => {
    const [showInactive, setShowInactive] = useState(false);

    const { data } = useTechnicians({
        limit: 20,
        isActive: showInactive ? undefined : true,
    });

    const techs = data?.data ?? [];

    const createMutation = useCreateTechnician();
    const updateMutation = useUpdateTechnician();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const handleCreate = (form: any) => {
        createMutation.mutate(form, {
            onSuccess: () => setOpen(false),
        });
    };

    const handleEdit = (tech: any) => {
        setSelected(tech);
        setOpen(true);
    };

    const handleUpdate = (form: any) => {
        updateMutation.mutate(
            { id: selected._id, data: form },
            { onSuccess: () => setOpen(false) }
        );
    };

    const handleToggle = (tech: any) => {
        updateMutation.mutate({
            id: tech._id,
            data: { isActive: !tech.isActive },
        });
    };

    return (
        <div className="flex flex-col gap-4">

            {/* PAGE HEADER */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm shadow-black/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-zinc-100">
                        Technicians
                    </h2>
                </div>

                <div className="flex items-center gap-2">

                    {/* FILTER CHIP */}
                    <button
                        onClick={() => setShowInactive((p) => !p)}
                        className={`h-9 px-3 rounded-full text-xs border transition-all duration-150 ${showInactive
                            ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                            : "bg-zinc-900 text-zinc-500 border-zinc-800"
                            }`}
                    >
                        {showInactive ? "Showing all" : "Active only"}
                    </button>

                    {/* ADD BUTTON */}
                    <Button
                        onClick={() => {
                            setSelected(null);
                            setOpen(true);
                        }}
                        className="h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Technician
                    </Button>
                </div>
            </div>

            {/* MOBILE LIST */}
            <div className="flex flex-col gap-3 lg:hidden">
                {techs.map((t) => (
                    <TechnicianCard
                        key={t._id}
                        tech={t}
                        onEdit={() => handleEdit(t)}
                        onToggle={() => handleToggle(t)}
                    />
                ))}
            </div>

            {/* DESKTOP TABLE */}
            <TechnicianTable
                data={techs}
                onEdit={handleEdit}
                onToggle={handleToggle}
            />

            {/* DRAWER */}
            <TechnicianFormDrawer
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={selected ? handleUpdate : handleCreate}
                defaultValues={selected || undefined}
            />
        </div>
    );
};
