import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "../../../components/shared/Drawer";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { Eye, EyeOff, X } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    defaultValues?: any;
    isEdit?: boolean;
}

export const UserFormDrawer: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    defaultValues,
    isEdit,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues || {
                name: "",
                email: "",
                mobile: "",
                role: "CUSTOMER",
                password: ""
            });
            setShowPassword(false);
        }
    }, [open, defaultValues, reset]);

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                    {isEdit ? "Edit User" : "Create New User"}
                </h2>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none">
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

                <FormField label="Email Address" error={errors.email?.message as string}>
                    <Input 
                        placeholder="john@example.com" 
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })} 
                        error={!!errors.email}
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

                {!isEdit && (
                    <>
                        <FormField label="Password" error={errors.password?.message as string}>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                error={!!errors.password}
                                className="text-white"
                                rightIcon={
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-1 text-zinc-400 hover:text-white transition-colors outline-none cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />
                        </FormField>

                        <FormField label="Role" error={errors.role?.message as string}>
                            <div className="relative">
                                <select 
                                    {...register("role", { required: "Role is required" })}
                                    className="w-full h-11 px-3 rounded-2xl border border-zinc-700 bg-zinc-900 text-white outline-none appearance-none"
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </FormField>
                    </>
                )}

                {isEdit && (
                    <FormField label="Role" error={errors.role?.message as string}>
                        <div className="relative">
                            <select 
                                {...register("role", { required: "Role is required" })}
                                className="w-full h-11 px-3 rounded-2xl border border-zinc-700 bg-zinc-900 text-white outline-none appearance-none"
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </FormField>
                )}

                <div className="mt-4 pb-4">
                    <Button type="submit" className="w-full font-semibold">
                        {isEdit ? "Update User" : "Create User"}
                    </Button>
                </div>
            </form>
        </Drawer>
    );
};
