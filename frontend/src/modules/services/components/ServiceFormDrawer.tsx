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

export const ServiceFormDrawer: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    defaultValues,
}) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues || {
                name: "",
                vehicleType: "2W",
                price: "",
                description: ""
            });
        }
    }, [open, defaultValues, reset]);

    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-lg mb-4">{defaultValues ? "Edit Service" : "New Service"}</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <Input placeholder="Name" {...register("name")} />
                <select
                    className="border border-zinc-300 bg-zinc-900 rounded-xl p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500 "
                    {...register("vehicleType")}
                >
                    <option value="2W">2W</option>
                    <option value="4W">4W</option>
                    <option value="CAB">CAB</option>
                </select>
                <Input
                    type="number"
                    placeholder="Price"
                    {...register("price")}
                />
                <Input
                    placeholder="Description"
                    {...register("description")}
                />

                <Button type="submit">Save</Button>
            </form>
        </Drawer>
    );
};

