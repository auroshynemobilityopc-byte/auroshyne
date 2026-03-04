import { useDashboardSummary } from "../hooks";
import { useNavigate } from "react-router-dom";
import {
    CalendarCheck, Clock, UserCheck, CheckCircle2, XCircle,
    IndianRupee, Sun, Cloud, Moon, RefreshCw, TrendingUp,
    ArrowRight
} from "lucide-react";

/* ─── helpers ──────────────────────────────────────────────────────────────── */
const now = new Date();
const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";
const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const MAX_SLOT_CAPACITY = 10;

/* ─── KPI card config ──────────────────────────────────────────────────────── */
const KPI_CONFIG = [
    {
        key: "total" as const,
        label: "Total Bookings",
        icon: CalendarCheck,
        gradient: "from-violet-500/20 to-purple-600/10",
        border: "border-violet-500/30",
        iconColor: "text-violet-400",
        iconBg: "bg-violet-500/15",
        valueColor: "text-violet-300",
    },
    {
        key: "pending" as const,
        label: "Pending",
        icon: Clock,
        gradient: "from-amber-500/20 to-orange-600/10",
        border: "border-amber-500/30",
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/15",
        valueColor: "text-amber-300",
    },
    {
        key: "assigned" as const,
        label: "Assigned",
        icon: UserCheck,
        gradient: "from-sky-500/20 to-blue-600/10",
        border: "border-sky-500/30",
        iconColor: "text-sky-400",
        iconBg: "bg-sky-500/15",
        valueColor: "text-sky-300",
    },
    {
        key: "completed" as const,
        label: "Completed",
        icon: CheckCircle2,
        gradient: "from-emerald-500/20 to-green-600/10",
        border: "border-emerald-500/30",
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/15",
        valueColor: "text-emerald-300",
    },
    {
        key: "cancelled" as const,
        label: "Cancelled",
        icon: XCircle,
        gradient: "from-red-500/20 to-rose-600/10",
        border: "border-red-500/30",
        iconColor: "text-red-400",
        iconBg: "bg-red-500/15",
        valueColor: "text-red-300",
    },
];

const SLOTS = [
    {
        key: "MORNING" as const, label: "Morning", time: "9 AM – 12 PM",
        icon: Sun, color: "bg-amber-400", trackColor: "bg-amber-400/15", textColor: "text-amber-400"
    },
    {
        key: "AFTERNOON" as const, label: "Afternoon", time: "12 PM – 4 PM",
        icon: Cloud, color: "bg-sky-400", trackColor: "bg-sky-400/15", textColor: "text-sky-400"
    },
    {
        key: "EVENING" as const, label: "Evening", time: "4 PM – 7 PM",
        icon: Moon, color: "bg-indigo-400", trackColor: "bg-indigo-400/15", textColor: "text-indigo-400"
    },
];

/* ─── Quick actions ────────────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
    { label: "View Bookings", path: "/admin/bookings", emoji: "📋" },
    { label: "Manage Customers", path: "/admin/users", emoji: "👤" },
    { label: "Services & Add-ons", path: "/admin/services", emoji: "🚗" },
    { label: "Technicians", path: "/admin/technicians", emoji: "👨‍🔧" },
];

/* ─── Component ────────────────────────────────────────────────────────────── */
export const DashboardPage = () => {
    const { data, isLoading, refetch, isFetching } = useDashboardSummary();
    const navigate = useNavigate();

    const completionRate =
        data && data.total > 0
            ? Math.round((data.completed / data.total) * 100)
            : 0;

    return (
        <div className="flex flex-col gap-5 pb-28 lg:pb-8">

            {/* ── HEADER ── */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{dateStr}</p>
                    <h1 className="text-2xl font-bold text-white mt-0.5">{greeting} 👋</h1>
                    <p className="text-sm text-zinc-400 mt-0.5">Here's what's happening today</p>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm text-zinc-300 transition-all active:scale-95 disabled:opacity-60"
                >
                    <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* ── TODAY'S REVENUE HERO ── */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/50 via-violet-900/30 to-zinc-900 p-5">
                {/* decorative circles */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />

                <div className="relative flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1">Today's Revenue</p>
                        {isLoading ? (
                            <div className="h-10 w-32 rounded-lg bg-zinc-800 animate-pulse" />
                        ) : (
                            <p className="text-4xl font-extrabold text-white tracking-tight">
                                ₹{data?.todayRevenue?.toLocaleString("en-IN") ?? "—"}
                            </p>
                        )}
                        <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">{completionRate}% completion rate</span>
                        </p>
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <IndianRupee className="w-8 h-8 text-indigo-300" />
                    </div>
                </div>

                {/* thin accent line at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-transparent" />
            </div>

            {/* ── KPI GRID ── */}
            <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Today's Bookings</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {KPI_CONFIG.map(({ key, label, icon: Icon, gradient, border, iconColor, iconBg, valueColor }) => (
                        <div
                            key={key}
                            className={`relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-4 flex flex-col gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-default`}
                        >
                            <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium leading-tight">{label}</p>
                                {isLoading ? (
                                    <div className="h-7 w-12 rounded-lg bg-zinc-800 animate-pulse mt-1" />
                                ) : (
                                    <p className={`text-2xl font-bold mt-0.5 ${valueColor}`}>{data?.[key] ?? 0}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SLOT LOAD ── */}
            <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Slot Load</p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
                    {SLOTS.map(({ key, label, time, icon: Icon, color, trackColor, textColor }) => {
                        const count = data?.slotCounts?.[key] ?? 0;
                        const pct = isLoading ? 0 : Math.min((count / MAX_SLOT_CAPACITY) * 100, 100);
                        return (
                            <div key={key} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg ${trackColor} flex items-center justify-center`}>
                                            <Icon className={`w-4 h-4 ${textColor}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{label}</p>
                                            <p className="text-[11px] text-zinc-500">{time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-bold ${textColor}`}>{count}</span>
                                        <span className="text-xs text-zinc-600">/{MAX_SLOT_CAPACITY}</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${color} rounded-full transition-all duration-700`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── QUICK ACTIONS ── */}
            <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Access</p>
                <div className="grid grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map(({ label, path, emoji }) => (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className="flex items-center justify-between gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-4 text-left transition-all active:scale-[0.97] group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{emoji}</span>
                                <span className="text-sm font-medium text-zinc-200">{label}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};
