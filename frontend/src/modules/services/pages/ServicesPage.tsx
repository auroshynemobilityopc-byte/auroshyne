import { useState } from "react";
import {
    useServices,
    useCreateService,
    useUpdateService,
} from "../hooks";
import { ServiceCard } from "../components/ServiceCard";
import { ServiceTable } from "../components/ServiceTable";
import { ServiceFormDrawer } from "../components/ServiceFormDrawer";
import { Button } from "../../../components/shared/Button";
import { Wrench, Plus } from "lucide-react";

export const ServicesPage = () => {
    const [showInactive, setShowInactive] = useState(false);

    const { data } = useServices({
        limit: 50,
        isActive: showInactive ? undefined : true,
    });

    const services = data?.data ?? [];

    const createMutation = useCreateService();
    const updateMutation = useUpdateService();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const handleCreate = (form: any) => {
        createMutation.mutate(form, {
            onSuccess: () => setOpen(false),
        });
    };

    const handleEdit = (s: any) => {
        setSelected(s);
        setOpen(true);
    };

    const handleUpdate = (form: any) => {
        updateMutation.mutate(
            { id: selected._id, data: form },
            { onSuccess: () => setOpen(false) }
        );
    };

    const handleToggle = (s: any) => {
        updateMutation.mutate({
            id: s._id,
            data: { isActive: !s.isActive },
        });
    };

    return (
        <div className="flex flex-col gap-4">

            {/* PAGE HEADER */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm shadow-black/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-zinc-100">
                        Services
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
                        Add Service
                    </Button>
                </div>
            </div>

            {/* MOBILE LIST */}
            <div className="flex flex-col gap-3 lg:hidden">
                {services.map((s) => (
                    <ServiceCard
                        key={s._id}
                        service={s}
                        onEdit={() => handleEdit(s)}
                        onToggle={() => handleToggle(s)}
                    />
                ))}
            </div>

            {/* DESKTOP TABLE */}
            <ServiceTable
                data={services}
                onEdit={handleEdit}
                onToggle={handleToggle}
            />

            {/* DRAWER */}
            <ServiceFormDrawer
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={selected ? handleUpdate : handleCreate}
                defaultValues={selected || undefined}
            />
        </div>
    );
};
