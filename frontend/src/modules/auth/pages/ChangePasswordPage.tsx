import { useForm } from "react-hook-form";
import { Card } from "../../../components/shared/Card";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { useChangePassword } from "../hooks";

interface FormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const ChangePasswordPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>();

    const changePassword = useChangePassword();

    const newPassword = watch("newPassword");

    return (
        <Card className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 shadow-sm shadow-black/20">
            <h1 className="text-lg font-semibold mb-4 text-zinc-100">
                Change Password
            </h1>

            <form
                onSubmit={handleSubmit((data) =>
                    changePassword.mutate({
                        currentPassword: data.currentPassword,
                        newPassword: data.newPassword,
                    })
                )}
                className="flex flex-col gap-4"
            >
                <FormField label="Current Password">
                    <Input
                        type="password"
                        {...register("currentPassword", { required: true })}
                    />
                </FormField>

                <FormField label="New Password">
                    <Input
                        type="password"
                        {...register("newPassword", { required: true })}
                    />
                </FormField>

                <FormField label="Confirm Password">
                    <Input
                        type="password"
                        {...register("confirmPassword", {
                            required: true,
                            validate: (value) =>
                                value === newPassword ||
                                "Passwords do not match",
                        })}
                    />
                </FormField>

                {/* ERROR MESSAGE */}
                {errors.confirmPassword && (
                    <p className="text-xs text-red-400">
                        {errors.confirmPassword.message}
                    </p>
                )}

                <Button
                    type="submit"
                    loading={changePassword.isPending}
                    className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98] transition-all duration-150"
                >
                    Update Password
                </Button>
            </form>
        </Card>
    );
};
