import { useEffect } from "react";
import { Drawer } from "../../../components/shared/Drawer";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { useForm } from "react-hook-form";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    defaultValues?: any;
}

export const AddonFormDrawer: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    defaultValues,
}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues || {
                name: "",
                price: "",
                vehicleType: "2W"
            });
        }
    }, [open, defaultValues, reset]);

    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-xl font-bold mb-6 text-zinc-100">{defaultValues ? "Edit Add-on" : "New Add-on"}</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300">Add-on Name *</label>
                    <Input 
                        placeholder="e.g. Interior Detailing" 
                        {...register("name", { required: "Name is required" })} 
                        error={!!errors.name}
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300">Vehicle Type *</label>
                    <select
                        className={`h-11 px-3 border bg-zinc-900 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors ${errors.vehicleType ? 'border-red-500' : 'border-zinc-700'}`}
                        {...register("vehicleType", { required: "Vehicle Type is required" })}
                    >
                        <option value="2W">2W (Two Wheeler)</option>
                        <option value="4W">4W (Four Wheeler)</option>
                        <option value="CAB">CAB</option>
                    </select>
                    {errors.vehicleType && <span className="text-xs text-red-500">{errors.vehicleType.message as string}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300">Price (₹) *</label>
                    <Input
                        type="number"
                        placeholder="e.g. 200"
                        {...register("price", { 
                            required: "Price is required",
                            min: { value: 0, message: "Price must be positive" }
                        })}
                        error={!!errors.price}
                    />
                    {errors.price && <span className="text-xs text-red-500">{errors.price.message as string}</span>}
                </div>

                <div className="pt-4 flex gap-3 mt-2">
                    <Button type="button" onClick={onClose} variant="secondary" className="flex-1 bg-zinc-800 hover:bg-zinc-700">Cancel</Button>
                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white">Save Add-on</Button>
                </div>
            </form>
        </Drawer>
    );
};
