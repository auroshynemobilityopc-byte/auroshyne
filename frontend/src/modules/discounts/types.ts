export interface Discount {
    _id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrderValue: number;
    maxDiscount?: number;
    startDate?: string;
    endDate?: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
