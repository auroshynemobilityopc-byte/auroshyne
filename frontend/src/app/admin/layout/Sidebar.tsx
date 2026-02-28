import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useLogout } from "../../../modules/auth/hooks";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Wrench,
    Layers,
    PlusSquare,
    UserCircle,
    LogOut,
    Settings as SettingsIcon
} from "lucide-react";

interface MenuItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

const menu: MenuItem[] = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Customers", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Bookings", path: "/admin/bookings", icon: <CalendarDays className="w-4 h-4" /> },
    { label: "Technicians", path: "/admin/technicians", icon: <Wrench className="w-4 h-4" /> },
    { label: "Services", path: "/admin/services", icon: <Layers className="w-4 h-4" /> },
    { label: "Add-ons", path: "/admin/addons", icon: <PlusSquare className="w-4 h-4" /> },
    { label: "Settings", path: "/admin/settings", icon: <SettingsIcon className="w-4 h-4" /> },
];

export const Sidebar: React.FC = () => {
    const logout = useLogout();

    return (
        <aside className="hidden lg:flex lg:flex-col w-64 border-r border-zinc-800 bg-zinc-950 p-4">

            {/* LOGO / TITLE */}
            <div className="flex items-center gap-2 mb-6 px-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm shadow-black/20">
                    A
                </div>
                <h2 className="text-lg font-semibold tracking-tight">Admin</h2>
            </div>

            {/* NAV SCROLL AREA */}
            <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) =>
                            clsx(
                                "h-11 px-3 rounded-xl flex items-center gap-3 text-sm transition-all duration-150",
                                isActive
                                    ? "bg-zinc-800 text-white border border-zinc-700"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            )
                        }
                    >
                        <span className="text-zinc-400">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* BOTTOM ACTIONS */}
            <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col gap-1">

                <NavLink
                    to="/admin/profile"
                    className={({ isActive }) =>
                        clsx(
                            "h-11 px-3 rounded-xl flex items-center gap-3 text-sm transition-all duration-150",
                            isActive
                                ? "bg-zinc-800 text-white border border-zinc-700"
                                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        )
                    }
                >
                    <UserCircle className="w-4 h-4" />
                    <span className="font-medium">Profile</span>
                </NavLink>

                <button
                    className="h-11 px-3 rounded-xl flex items-center gap-3 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-all duration-150"
                    onClick={() => logout.mutate()}
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};
