import { Drawer } from "../../../components/shared/Drawer";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { useForm } from "react-hook-form";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (txnId: string) => void;
}

export const UpiTxnDrawer: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const { register, handleSubmit } = useForm();

    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-lg mb-4">UPI Transaction</h2>

            <form
                onSubmit={handleSubmit((d) => onSubmit(d.transactionId))}
                className="flex flex-col gap-3"
            >
                <Input placeholder="Transaction ID" {...register("transactionId")} />

                <Button type="submit">Confirm Payment</Button>
            </form>
        </Drawer>
    );
};
