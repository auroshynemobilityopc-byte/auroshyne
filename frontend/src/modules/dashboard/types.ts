export type SlotKey = "MORNING" | "AFTERNOON" | "EVENING";

export interface DashboardSummary {
    total: number;
    pending: number;
    assigned: number;
    completed: number;
    cancelled: number;
    todayRevenue: number;
    slotCounts: Record<SlotKey, number>;
}

export interface DashboardSummaryResponse {
    success: boolean;
    data: DashboardSummary;
}
