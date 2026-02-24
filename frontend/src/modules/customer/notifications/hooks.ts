import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
} from "./api";
import toast from "react-hot-toast";
import { useCustomerAuth } from "../../../app/customer/CustomerAuthContext";

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const NOTIFICATION_KEYS = {
    all: ["notifications"] as const,
    list: (page: number, isRead?: boolean) =>
        ["notifications", "list", page, isRead] as const,
    unreadCount: ["notifications", "unreadCount"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated notifications.
 * Only runs when the customer is authenticated.
 */
export const useMyNotifications = (page = 1, isRead?: boolean) => {
    const { isAuthenticated } = useCustomerAuth();

    return useQuery({
        queryKey: NOTIFICATION_KEYS.list(page, isRead),
        queryFn: () => getMyNotifications(page, 20, isRead),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 1,
    });
};

/**
 * Unread badge counter.
 * Refetches every 60 s automatically when the window is focused,
 * so the bell icon stays up to date without a full page reload.
 */
export const useUnreadCount = () => {
    const { isAuthenticated } = useCustomerAuth();

    return useQuery({
        queryKey: NOTIFICATION_KEYS.unreadCount,
        queryFn: getUnreadCount,
        enabled: isAuthenticated,
        staleTime: 1000 * 30,        // 30 s
        refetchInterval: 1000 * 60,  // poll every 60 s (lightweight)
        refetchIntervalInBackground: false,
        retry: 1,
    });
};

/**
 * Mark a single notification as read.
 * Optimistically updates both the list and badge count caches.
 */
export const useMarkAsRead = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: markNotificationRead,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
            qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount });
        },
        onError: () => {
            toast.error("Failed to mark notification as read.");
        },
    });
};

/**
 * Mark all notifications as read.
 */
export const useMarkAllAsRead = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
            qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount });
        },
        onError: () => {
            toast.error("Failed to mark all as read.");
        },
    });
};
