import { Drawer } from "../../../components/shared/Drawer";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { useForm } from "react-hook-form";

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
    const { register, handleSubmit } = useForm({
        defaultValues,
    });

    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-lg mb-4">Technician</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <Input placeholder="Name" {...register("name")} />
                <Input placeholder="Mobile" {...register("mobile")} />

                <Button type="submit">Save</Button>
            </form>
        </Drawer>
    );
};
