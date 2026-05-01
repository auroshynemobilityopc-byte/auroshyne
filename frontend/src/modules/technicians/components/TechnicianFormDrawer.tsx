import { useEffect } from "react";
import { Drawer } from "../../../components/shared/Drawer";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; mobile: string }) => void;
    defaultValues?: { name: string; mobile: string };
}

export const TechnicianFormDrawer: React.FC<Props> = ({
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
                mobile: ""
            });
        }
    }, [open, defaultValues, reset]);

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                    {defaultValues ? "Edit Technician" : "Add New Technician"}
                </h2>
                <button 
                    onClick={onClose} 
                    className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-100px)] lg:max-h-[calc(100vh-120px)] pb-6 no-scrollbar"
            >
                <FormField label="Full Name" error={errors.name?.message as string}>
                    <Input 
                        placeholder="John Doe" 
                        {...register("name", { required: "Name is required" })} 
                        error={!!errors.name}
                        className="text-white"
                    />
                </FormField>

                <FormField label="Mobile Number" error={errors.mobile?.message as string}>
                    <Input 
                        placeholder="1234567890" 
                        {...register("mobile", { 
                            required: "Mobile is required",
                            minLength: {
                                value: 10,
                                message: "Mobile number must be at least 10 digits"
                            }
                        })} 
                        error={!!errors.mobile}
                        className="text-white"
                    />
                </FormField>

                <div className="mt-4 pb-4">
                    <Button type="submit" className="w-full font-semibold">
                        {defaultValues ? "Update Technician" : "Create Technician"}
                    </Button>
                </div>
            </form>
        </Drawer>
    );
};
