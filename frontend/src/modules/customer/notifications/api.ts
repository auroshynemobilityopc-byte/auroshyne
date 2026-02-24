import { customerApi } from "../../../app/customer/customerApi";
import type {
    NotificationListResponse,
    UnreadCountResponse,
} from "./types";

/**
 * Fetch paginated notifications for the logged-in customer.
 */
export const getMyNotifications = async (
    page = 1,
    limit = 20,
    isRead?: boolean
): Promise<NotificationListResponse> => {
    const params: Record<string, any> = { page, limit };
    if (isRead !== undefined) params.isRead = isRead;

    const response = await customerApi.get("/notifications", { params });
    return response.data;
};

/**
 * Lightweight badge counter – only returns { unreadCount: N }.
 */
export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
    const response = await customerApi.get("/notifications/unread-count");
    return response.data;
};

/**
 * Mark a single notification as read.
 */
export const markNotificationRead = async (id: string): Promise<void> => {
    await customerApi.patch(`/notifications/${id}/read`);
};

/**
 * Mark every notification as read in one shot.
 */
export const markAllNotificationsRead = async (): Promise<void> => {
    await customerApi.patch("/notifications/read-all");
};
