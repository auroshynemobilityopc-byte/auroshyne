import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useUnreadCount } from "../hooks";

/**
 * NotificationBell
 *
 * Displays a bell icon that links to /notifications.
 * Shows an animated badge with the unread count when > 0.
 * Silently hides itself when the user is not authenticated
 * (the hook is auth-gated so it simply won't fire).
 */
export function NotificationBell() {
    const { data } = useUnreadCount();
    const count = data?.unreadCount ?? 0;

    return (
        <Link
            to="/notifications"
            aria-label={count > 0 ? `${count} unread notifications` : "Notifications"}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
        >
            <Bell className="w-5 h-5 text-text-grey hover:text-white transition-colors" />

            <AnimatePresence>
                {count > 0 && (
                    <motion.span
                        key="badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-blue text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-brand-blue/40 pointer-events-none"
                    >
                        {count > 99 ? "99+" : count}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    );
}
