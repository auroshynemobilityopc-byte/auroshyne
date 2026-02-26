import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "../../../components/shared/Drawer";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import type { Discount } from "../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    defaultValues?: Discount;
    isEdit?: boolean;
}

export const DiscountFormDrawer: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    defaultValues,
    isEdit,
}) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues || {
                code: "",
                type: "percentage",
                value: undefined,
                minOrderValue: 0,
                maxDiscount: undefined,
                usageLimit: 0,
                description: "",
            });
        }
    }, [open, defaultValues, reset]);

    const submitFn = (data: any) => {
        const payload = {
            ...data,
            value: Number(data.value),
            minOrderValue: Number(data.minOrderValue),
            maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
            usageLimit: Number(data.usageLimit),
        };
        onSubmit(payload);
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-lg mb-4 text-zinc-100 font-semibold">{isEdit ? "Edit Discount" : "Create Discount"}</h2>

            <form
                onSubmit={handleSubmit(submitFn)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400">Discount Code *</label>
                    <Input placeholder="e.g. SUMMER20" {...register("code")} disabled={isEdit} className="uppercase font-medium" />
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-xs text-zinc-400">Type *</label>
                        <select
                            {...register("type")}
                            className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 outline-none focus:border-indigo-500/50 text-sm transition-colors text-zinc-100 placeholder:text-zinc-600 appearance-none"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-xs text-zinc-400">Value *</label>
                        <Input type="number" step="0.01" min="0" placeholder="e.g. 20" {...register("value")} required />
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-xs text-zinc-400">Min Order Value</label>
                        <Input type="number" min="0" placeholder="0" {...register("minOrderValue")} />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-xs text-zinc-400">Max Discount (opt)</label>
                        <Input type="number" min="0" placeholder="Unlimited" {...register("maxDiscount")} />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400">Total Usage Limit</label>
                    <Input type="number" min="0" placeholder="0 for Unlimited" {...register("usageLimit")} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400">Description</label>
                    <Input placeholder="Short description..." {...register("description")} />
                </div>

                <Button type="submit" className="mt-2 h-11">
                    {isEdit ? "Update Discount" : "Create Discount"}
                </Button>
            </form>
        </Drawer>
    );
};
