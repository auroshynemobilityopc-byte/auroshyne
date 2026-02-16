import { ActionSheet } from "../../../components/mobile/ActionSheet";
import type { BookingStatus } from "../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (status: BookingStatus) => void;
}

export const StatusActions: React.FC<Props> = ({
    open,
    onClose,
    onSelect,
}) => {
    return (
        <ActionSheet
            open={open}
            onClose={onClose}
            actions={[
                { label: "Start", onClick: () => onSelect("IN_PROGRESS") },
                { label: "Complete", onClick: () => onSelect("COMPLETED") },
                {
                    label: "Cancel Booking",
                    onClick: () => onSelect("CANCELLED"),
                    destructive: true,
                },
            ]}
        />
    );
};
