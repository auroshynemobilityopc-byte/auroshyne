import { ActionSheet } from "../../../components/mobile/ActionSheet";
import type { BookingStatus } from "../types";
import { toast } from "react-hot-toast";

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (status: BookingStatus) => void;
    currentStatus?: BookingStatus;
}

export const StatusActions: React.FC<Props> = ({
    open,
    onClose,
    onSelect,
    currentStatus = "PENDING",
}) => {
    const actions = [];

    // If it's already completed or cancelled, we don't need any actions.
    if (currentStatus !== "COMPLETED" && currentStatus !== "CANCELLED") {
        if (currentStatus !== "IN_PROGRESS") {
            actions.push({
                label: "Start",
                onClick: () => {
                    if (currentStatus === "PENDING") {
                        toast.error("Please assign a technician before starting the booking.");
                        return;
                    }
                    onSelect("IN_PROGRESS");
                },
            });
        }

        if (currentStatus === "IN_PROGRESS") {
            actions.push({
                label: "Complete",
                onClick: () => onSelect("COMPLETED"),
            });
        }

        actions.push({
            label: "Cancel Booking",
            onClick: () => onSelect("CANCELLED"),
            destructive: true,
        });
    }

    return (
        <ActionSheet
            open={open}
            onClose={onClose}
            actions={actions}
        />
    );
};
