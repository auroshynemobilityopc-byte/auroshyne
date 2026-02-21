import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "../../../components/shared/Drawer";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";

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
    const { register, handleSubmit, reset } = useForm({
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
        }
    }, [open, defaultValues, reset]);

    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-lg mb-4">{isEdit ? "Edit User" : "Create User"}</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <Input placeholder="Name" {...register("name")} />
                <Input placeholder="Email" {...register("email")} />
                <Input placeholder="Mobile" {...register("mobile")} />

                {!isEdit && (
                    <>
                        <Input
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                        />
                        <Input placeholder="Role (ADMIN/CUSTOMER)" {...register("role")} />
                    </>
                )}

                <Button type="submit">Save</Button>
            </form>
        </Drawer>
    );
};
