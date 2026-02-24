export type NotificationType =
    | 'TECHNICIAN_ASSIGNED'
    | 'BOOKING_STATUS_UPDATED'
    | 'BOOKING_CANCELLED'
    | 'PAYMENT_CONFIRMED'
    | 'REFUND_INITIATED'
    | 'GENERAL';

export interface Notification {
    _id: string;
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    data: Record<string, any>;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationListResponse {
    success: boolean;
    data: Notification[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
    unreadCount: number;
}

export interface UnreadCountResponse {
    success: boolean;
    unreadCount: number;
}
