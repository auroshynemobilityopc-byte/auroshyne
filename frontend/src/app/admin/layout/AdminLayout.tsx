import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
    title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ title }) => {
    const location = useLocation();

    const getTitle = () => {
        if (title) return title;

        if (location.pathname.includes("/bookings/")) return "Booking Details";
        if (location.pathname.includes("/invoices/")) return "Invoice";
        if (location.pathname.includes("/bookings")) return "Bookings";
        if (location.pathname.includes("/technicians")) return "Technicians";
        if (location.pathname.includes("/services")) return "Services";
        if (location.pathname.includes("/addons")) return "Add-ons";
        if (location.pathname.includes("/users")) return "Customers";
        if (location.pathname.includes("/profile")) return "Profile";
        if (location.pathname.includes("/change-password")) return "Change Password";

        return "Dashboard";
    };

    const isModuleTabVisible =
        location.pathname.startsWith("/admin/bookings") ||
        location.pathname.startsWith("/admin/services") ||
        location.pathname.startsWith("/admin/addons") ||
        location.pathname.startsWith("/admin/technicians");

    const mobileModuleTabs = (
        <div className="lg:hidden border-b border-zinc-800 bg-zinc-950">
            <div className="flex overflow-x-auto no-scrollbar">
                {[
                    { label: "Bookings", to: "/admin/bookings" },
                    { label: "Services", to: "/admin/services" },
                    { label: "Add-ons", to: "/admin/addons" },
                    { label: "Technicians", to: "/admin/technicians" }
                ].map((item) => {
                    const isActive = location.pathname.startsWith(item.to);

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={clsx(
                                "h-11 px-4 flex items-center text-xs font-medium whitespace-nowrap border-b-2 transition-all duration-150",
                                isActive
                                    ? "border-indigo-500 text-indigo-400"
                                    : "border-transparent text-zinc-400"
                            )}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">

            {/* DESKTOP SIDEBAR */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0">

                {/* TOPBAR */}
                <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
                    <Topbar title={getTitle()} />
                </div>

                {/* MOBILE MODULE TABS */}
                {isModuleTabVisible && mobileModuleTabs}

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-3 pb-24 lg:p-6 lg:pb-6">
                    <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>

                {/* MOBILE BOTTOM NAV */}
                <div className="lg:hidden">
                    <BottomNav />
                </div>
            </div>
        </div>
    );
};
