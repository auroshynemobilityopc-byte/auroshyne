import React, { useState, useRef, useEffect } from "react";
import { Bell, MoreVertical, Download, User, KeyRound, LogOut, Settings, Mail, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { usePWAInstall } from "../../../lib/usePWAInstall";
import { useLogout } from "../../../modules/auth/hooks";

interface TopbarProps {
    title?: string;
    right?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, right }) => {
    const { install, isInstalled } = usePWAInstall();
    const logout = useLogout();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

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

            {/* MOBILE ACTIONS */}
            <div className="flex items-center gap-1 lg:hidden">
                {!isInstalled && (
                    <button
                        onClick={install}
                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-800 transition-all duration-150 focus:outline-none"
                        title="Install App"
                    >
                        <Download className="w-5 h-5 text-indigo-400" />
                    </button>
                )}

                <div className="relative group" ref={dropdownRef}>
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-800 transition-all duration-150 focus:outline-none"
                    >
                        <MoreVertical className="w-5 h-5 text-zinc-400" />
                    </button>

                    {/* DROPDOWN */}
                    <div className={`absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg shadow-black/30 transition-all duration-150 ${dropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

                        <Link
                            to="/admin/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-t-xl"
                        >
                            <User className="w-4 h-4 text-zinc-400" />
                            Profile / Me
                        </Link>

                        <div className="h-px bg-zinc-800" />

                        <Link
                            to="/admin/change-password"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                        >
                            <KeyRound className="w-4 h-4 text-zinc-400" />
                            Change Password
                        </Link>

                        <div className="h-px bg-zinc-800" />

                        <Link
                            to="/admin/settings"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                        >
                            <Settings className="w-4 h-4 text-zinc-400" />
                            Settings
                        </Link>

                        <div className="h-px bg-zinc-800" />

                        <Link
                            to="/admin/email-templates"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                        >
                            <Mail className="w-4 h-4 text-zinc-400" />
                            Email Templates
                        </Link>

                        <div className="h-px bg-zinc-800" />

                        <Link
                            to="/admin/reviews"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                        >
                            <Star className="w-4 h-4 text-zinc-400" />
                            Reviews
                        </Link>

                        <div className="h-px bg-zinc-800" />

                        <button
                            onClick={() => logout.mutate()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-b-xl"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
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
