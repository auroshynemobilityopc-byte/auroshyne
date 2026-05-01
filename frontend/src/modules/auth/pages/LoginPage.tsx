import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks";
import { Card } from "../../../components/shared/Card";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

interface FormValues {
    email: string;
    password: string;
}

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const login = useLogin();

    const onSubmit = (data: FormValues) => {
        login.mutate(data, {
            onSuccess: (res) => {
                if (res.user.role !== "ADMIN") {
                    toast.error("Not authorized. Admin access only.");
                    return;
                }
                toast.success("Login successful!");
                window.location.href = "/admin";
            },
            onError: (error: any) => {
                let message = "An unexpected error occurred during login";
                if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                    message = "Server timeout. Please check your connection and try again.";
                } else if (!error.response) {
                    message = "Network error. Please check your internet connection.";
                } else if (error.response?.status === 401) {
                    message = "Incorrect email or password.";
                } else if (error.response?.data?.message) {
                    message = error.response.data.message;
                }

                toast.error(message);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            {/* Background ambient light effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

            <Card className="w-full max-w-md p-8 relative z-10 bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <span className="text-2xl font-bold text-white tracking-widest">AS</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-zinc-400 text-sm">Sign in to manage your services</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FormField label="Email" error={errors.email?.message}>
                        <Input 
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })} 
                            placeholder="admin@auroshyne.com"
                            className="text-white"
                            error={!!errors.email}
                        />
                    </FormField>

                    <FormField label="Password" error={errors.password?.message}>
                        <Input
                            type={showPassword ? "text" : "password"}
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            placeholder="••••••••"
                            className="text-white"
                            error={!!errors.password}
                            rightIcon={
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 text-zinc-400 hover:text-white transition-colors outline-none cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />
                    </FormField>

                    <Button type="submit" loading={login.isPending} className="mt-2 font-semibold py-2.5">
                        Sign In
                    </Button>
                </form>
            </Card>
        </div>
    );
};
