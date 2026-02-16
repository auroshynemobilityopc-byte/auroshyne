import { useState } from "react";
import {
    useAddons,
    useCreateAddon,
    useUpdateAddon,
} from "../hooks";
import { AddonCard } from "../components/AddonCard";
import { AddonTable } from "../components/AddonTable";
import { AddonFormDrawer } from "../components/AddonFormDrawer";
import { Button } from "../../../components/shared/Button";
import { Layers, Plus } from "lucide-react";

export const AddonsPage = () => {
    const [showInactive, setShowInactive] = useState(false);

    const { data } = useAddons({
        limit: 50,
        isActive: showInactive ? undefined : true,
    });

    const addons = data?.data ?? [];

    const createMutation = useCreateAddon();
    const updateMutation = useUpdateAddon();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const handleCreate = (form: any) => {
        createMutation.mutate(form, {
            onSuccess: () => setOpen(false),
        });
    };

    const handleEdit = (a: any) => {
        setSelected(a);
        setOpen(true);
    };

    const handleUpdate = (form: any) => {
        updateMutation.mutate(
            { id: selected._id, data: form },
            { onSuccess: () => setOpen(false) }
        );
    };

    const handleToggle = (a: any) => {
        updateMutation.mutate({
            id: a._id,
            data: { isActive: !a.isActive },
        });
    };

    return (
        <div className="flex flex-col gap-4">

            {/* PAGE HEADER */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm shadow-black/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-zinc-100">
                        Add-ons
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
                        Add Add-on
                    </Button>
                </div>
            </div>

            {/* MOBILE LIST */}
            <div className="flex flex-col gap-3 lg:hidden">
                {addons.map((a) => (
                    <AddonCard
                        key={a._id}
                        addon={a}
                        onEdit={() => handleEdit(a)}
                        onToggle={() => handleToggle(a)}
                    />
                ))}
            </div>

            {/* DESKTOP TABLE */}
            <AddonTable
                data={addons}
                onEdit={handleEdit}
                onToggle={handleToggle}
            />

            {/* DRAWER */}
            <AddonFormDrawer
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={selected ? handleUpdate : handleCreate}
                defaultValues={selected || undefined}
            />
        </div>
    );
};
