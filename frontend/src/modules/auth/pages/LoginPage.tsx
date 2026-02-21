import { useForm } from "react-hook-form";
import { useLogin } from "../hooks";
import { Card } from "../../../components/shared/Card";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { toast } from "react-hot-toast";

interface FormValues {
    email: string;
    password: string;
}

export const LoginPage = () => {
    const { register, handleSubmit } = useForm<FormValues>();
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
                const message = error.response?.data?.message || "An unexpected error occurred during login";
                toast.error(error.response?.data?.message);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-sm">
                <h1 className="text-lg font-semibold mb-4 text-center text-white">Admin Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField label="Email">
                        <Input {...register("email")} placeholder="admin@carwash.com"
                            className="text-white"
                        />
                    </FormField>

                    <FormField label="Password">
                        <Input
                            type="password"
                            {...register("password")}
                            placeholder="••••••••"
                            className="text-white"
                        />
                    </FormField>

                    <Button type="submit" loading={login.isPending}>
                        Login
                    </Button>
                </form>
            </Card>
        </div>
    );
};
