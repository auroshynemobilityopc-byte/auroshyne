import { Drawer } from "../../../components/shared/Drawer";
import { Button } from "../../../components/shared/Button";

interface Props {
    open: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

export const BookingFilters: React.FC<Props> = ({
    open,
    onClose,
    onApply,
}) => {
    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-lg mb-4">Filters</h2>

            {/* Replace with real inputs later */}
            <Button onClick={() => onApply({ status: "PENDING" })}>
                Pending
            </Button>
        </Drawer>
    );
};
