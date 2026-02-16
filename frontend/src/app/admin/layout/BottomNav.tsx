import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { LayoutDashboard, CalendarDays, Users } from "lucide-react";

interface NavItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Bookings", path: "/admin/bookings", icon: <CalendarDays className="w-5 h-5" /> },
    { label: "Customers", path: "/admin/users", icon: <Users className="w-5 h-5" /> }
];

export const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 pb-[env(safe-area-inset-bottom)] lg:hidden">

            {/* TOP GLOW BORDER */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            <div className="flex items-center justify-around h-full">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) =>
                            clsx(
                                "flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-all duration-150 active:scale-[0.95]",
                                isActive
                                    ? "text-indigo-400"
                                    : "text-zinc-500 active:text-white"
                            )
                        }
                    >
                        {/* ICON */}
                        <span
                            className={clsx(
                                "text-lg leading-none transition-all duration-150",
                                "group"
                            )}
                        >
                            {item.icon}
                        </span>

                        {/* LABEL */}
                        <span className="text-[11px] font-medium">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
