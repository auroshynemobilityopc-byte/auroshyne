import React from "react";
import { Bell, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

interface TopbarProps {
    title?: string;
    right?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, right }) => {
    return (
        <div className="h-14 flex items-center justify-between px-3 lg:px-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">

            {/* LEFT — TITLE */}
            <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-sm lg:text-base font-semibold truncate">
                    {title}
                </h1>
            </div>

            {/* RIGHT — DESKTOP ACTIONS */}
            <div className="hidden lg:flex items-center gap-2">
                {right}

                <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-800 transition-all duration-150">
                    <Bell className="w-5 h-5 text-zinc-400" />
                </button>

                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-medium ml-1">
                    A
                </div>
            </div>

            {/* MOBILE ACTIONS WITH DROPDOWN */}
            <div className="relative lg:hidden group">
                <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-800 transition-all duration-150 focus:outline-none">
                    <MoreVertical className="w-5 h-5 text-zinc-400" />
                </button>

                {/* DROPDOWN */}
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg shadow-black/30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all duration-150">

                    <Link
                        to="/admin/profile"
                        className="block px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-t-xl"
                    >
                        Profile / Me
                    </Link>

                    <div className="h-px bg-zinc-800" />

                    <Link
                        to="/admin/change-password"
                        className="block px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                        Change Password
                    </Link>

                    <Link
                        to="/admin/logout"
                        className="block px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-b-xl"
                    >
                        Logout
                    </Link>
                </div>
            </div>

            {/* MOBILE QUICK LINKS BAR (SCROLLABLE) */}
            {right && (
                <div className="absolute left-0 right-0 bottom-[-48px] lg:hidden px-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {right}
                    </div>
                </div>
            )}
        </div>
    );
};
