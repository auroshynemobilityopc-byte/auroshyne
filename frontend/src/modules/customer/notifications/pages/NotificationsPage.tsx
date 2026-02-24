import { useState } from "react";
import { Bell, BellOff, CheckCheck, Wrench, Car, Ban, CreditCard, RotateCcw, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { useMyNotifications, useMarkAsRead, useMarkAllAsRead } from "../hooks";
import type { Notification, NotificationType } from "../types";
import { formatDistanceToNow } from "date-fns";

// ─── Icon + colour map per notification type ──────────────────────────────────

const TYPE_CONFIG: Record<
    NotificationType,
    { icon: React.ElementType; colour: string; bg: string }
> = {
    TECHNICIAN_ASSIGNED: {
        icon: Wrench,
        colour: "text-brand-blue",
        bg: "bg-brand-blue/10",
    },
    BOOKING_STATUS_UPDATED: {
        icon: Car,
        colour: "text-amber-400",
        bg: "bg-amber-400/10",
    },
    BOOKING_CANCELLED: {
        icon: Ban,
        colour: "text-red-400",
        bg: "bg-red-400/10",
    },
    PAYMENT_CONFIRMED: {
        icon: CreditCard,
        colour: "text-green-400",
        bg: "bg-green-400/10",
    },
    REFUND_INITIATED: {
        icon: RotateCcw,
        colour: "text-purple-400",
        bg: "bg-purple-400/10",
    },
    GENERAL: {
        icon: Info,
        colour: "text-text-grey",
        bg: "bg-white/5",
    },
};

// ─── Single notification card ─────────────────────────────────────────────────

function NotificationCard({
    notification,
    onRead,
}: {
    notification: Notification;
    onRead: (id: string) => void;
}) {
    const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.GENERAL;
    const Icon = cfg.icon;

    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative flex gap-4 p-4 rounded-2xl border transition-colors",
                notification.isRead
                    ? "bg-charcoal-800/40 border-white/5"
                    : "bg-charcoal-800 border-brand-blue/20"
            )}
        >
            {/* Unread dot */}
            {!notification.isRead && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-blue" />
            )}

            {/* Icon badge */}
            <div
                className={cn(
                    "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center",
                    cfg.bg
                )}
            >
                <Icon className={cn("w-5 h-5", cfg.colour)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
                <p className={cn("text-sm font-semibold mb-0.5", notification.isRead ? "text-white/70" : "text-white")}>
                    {notification.title}
                </p>
                <p className="text-sm text-text-grey leading-relaxed">
                    {notification.message}
                </p>
                <p className="text-xs text-white/30 mt-2">{timeAgo}</p>
            </div>

            {/* Mark as read */}
            {!notification.isRead && (
                <button
                    onClick={() => onRead(notification._id)}
                    title="Mark as read"
                    className="flex-shrink-0 self-center p-2 rounded-lg hover:bg-white/10 text-text-grey hover:text-brand-blue transition-colors"
                >
                    <CheckCheck className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
}

// ─── Tab button ───────────────────────────────────────────────────────────────

function Tab({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                active ? "bg-brand-blue text-white" : "text-text-grey hover:text-white"
            )}
        >
            {label}
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabKey = "all" | "unread";

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("all");

    const isReadFilter = activeTab === "unread" ? false : undefined;

    const { data, isLoading, isError } = useMyNotifications(1, isReadFilter);
    const markRead = useMarkAsRead();
    const markAll = useMarkAllAsRead();

    const notifications = data?.data ?? [];
    const unreadCount = data?.unreadCount ?? 0;

    const handleMarkRead = (id: string) => {
        markRead.mutate(id);
    };

    const handleMarkAll = () => {
        markAll.mutate();
    };

    return (
        <div className="p-6 pb-28 md:max-w-2xl md:mx-auto w-full">
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-text-grey mt-0.5">
                            {unreadCount} unread
                        </p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAll}
                        disabled={markAll.isPending}
                        className="flex items-center gap-1.5 text-xs font-medium text-brand-blue hover:text-brand-accent transition-colors disabled:opacity-50"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all read
                    </button>
                )}
            </div>

            {/* ── Tabs ── */}
            <div className="mb-5 p-1 bg-charcoal-800 rounded-lg flex">
                <Tab
                    label="All"
                    active={activeTab === "all"}
                    onClick={() => setActiveTab("all")}
                />
                <Tab
                    label={`Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
                    active={activeTab === "unread"}
                    onClick={() => setActiveTab("unread")}
                />
            </div>

            {/* ── States ── */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-24 rounded-2xl bg-charcoal-800 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {isError && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                    <BellOff className="w-10 h-10 text-zinc-600" />
                    <p className="text-text-grey text-sm">
                        Could not load notifications.
                        <br />
                        Please check your connection and try again.
                    </p>
                </div>
            )}

            {!isLoading && !isError && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-charcoal-800 flex items-center justify-center">
                        <Bell className="w-7 h-7 text-zinc-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-white/70">
                            {activeTab === "unread" ? "All caught up!" : "No notifications yet"}
                        </p>
                        <p className="text-sm text-text-grey mt-1">
                            {activeTab === "unread"
                                ? "You have no unread notifications."
                                : "We'll notify you when something happens with your bookings."}
                        </p>
                    </div>
                </div>
            )}

            {!isLoading && !isError && notifications.length > 0 && (
                <AnimatePresence mode="popLayout">
                    <div className="space-y-3">
                        {notifications.map((n: Notification) => (
                            <NotificationCard
                                key={n._id}
                                notification={n}
                                onRead={handleMarkRead}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
}
