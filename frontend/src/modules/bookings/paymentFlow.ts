import type { PaymentStatus } from "./types";

export const paymentTransitions: Record<
    PaymentStatus,
    PaymentStatus[]
> = {
    UNPAID: ["PAID", "FAILED"],
    PAID: ["REFUND_INITIATED"],
    FAILED: ["PAID"],
    REFUND_INITIATED: ["REFUNDED"],
    REFUNDED: [],
};
