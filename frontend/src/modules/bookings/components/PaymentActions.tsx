import { ActionSheet } from "../../../components/mobile/ActionSheet";
import type { PaymentStatus } from "../types";
import { paymentTransitions } from "../paymentFlow";

interface Props {
    open: boolean;
    status: PaymentStatus;
    onClose: () => void;
    onSelect: (status: PaymentStatus, method?: "CASH" | "UPI") => void;
}

export const PaymentActions: React.FC<Props> = ({
    open,
    status,
    onClose,
    onSelect,
}) => {
    const nextStates = paymentTransitions[status];

    return (
        <ActionSheet
            open={open}
            onClose={onClose}
            actions={[
                ...(nextStates.includes("PAID")
                    ? [
                        {
                            label: "Mark Cash Paid",
                            onClick: () => onSelect("PAID", "CASH"),
                        },
                        {
                            label: "Mark UPI Paid",
                            onClick: () => onSelect("PAID", "UPI"),
                        },
                    ]
                    : []),

                ...(nextStates.includes("FAILED")
                    ? [
                        {
                            label: "Mark Failed",
                            onClick: () => onSelect("FAILED"),
                            destructive: true,
                        },
                    ]
                    : []),

                ...(nextStates.includes("REFUND_INITIATED")
                    ? [
                        {
                            label: "Initiate Refund",
                            onClick: () => onSelect("REFUND_INITIATED"),
                        },
                    ]
                    : []),

                ...(nextStates.includes("REFUNDED")
                    ? [
                        {
                            label: "Complete Refund",
                            onClick: () => onSelect("REFUNDED"),
                        },
                    ]
                    : []),
            ]}
        />
    );
};
