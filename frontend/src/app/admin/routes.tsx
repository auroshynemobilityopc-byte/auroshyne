import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "./layout/AdminLayout";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { LoginPage } from "../../modules/auth/pages/LoginPage";
import { ChangePasswordPage } from "../../modules/auth/pages/ChangePasswordPage";
import { DashboardPage } from "../../modules/dashboard/pages/DashboardPage";
import { BookingsPage } from "../../modules/bookings/pages/BookingsPage";
import { TechniciansPage } from "../../modules/technicians/pages/TechniciansPage";
import { ServicesPage } from "../../modules/services/pages/ServicesPage";
import { AddonsPage } from "../../modules/addons/pages/AddonsPage";
import { UsersPage } from "../../modules/users/pages/UsersPage";
import { ProfilePage } from "../../modules/users/pages/ProfilePage";
import { BookingDetailsPage } from "../../modules/bookings/pages/BookingDetailsPage";
import { InvoicePage } from "../../modules/invoices/pages/InvoicePage";

export const adminRoutes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/admin" replace />
    },
    {
        path: "/admin/login",
        element: <GuestGuard />,
        children: [{ index: true, element: <LoginPage /> }],
    },
    {
        path: "/admin",
        element: <AuthGuard />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: "change-password", element: <ChangePasswordPage /> },
                    { path: "bookings", element: <BookingsPage /> },
                    { path: "technicians", element: <TechniciansPage /> },
                    { path: "services", element: <ServicesPage /> },
                    { path: "addons", element: <AddonsPage /> },
                    { path: "users", element: <UsersPage /> },
                    { path: "profile", element: <ProfilePage /> },
                    { path: "bookings/:id", element: <BookingDetailsPage /> },
                    { path: "invoices/:bookingId", element: <InvoicePage /> }
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
