import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "../../modules/customer/shared/components/Layout";
import { CustomerAuthGuard, CustomerGuestGuard } from "./guards/CustomerGuards";
import HomePage from "../../modules/customer/home/pages/HomePage";
import LoginPage from "../../modules/customer/auth/pages/LoginPage";
import RegisterPage from "../../modules/customer/auth/pages/RegisterPage";
import BookingPage from "../../modules/customer/booking/pages/BookingPage";
import HistoryPage from "../../modules/customer/history/pages/HistoryPage";
import ProfilePage from "../../modules/customer/profile/pages/ProfilePage";
import EditProfilePage from "../../modules/customer/profile/pages/EditProfilePage";
import SavedDataPage from "../../modules/customer/profile/pages/SavedDataPage";

// Deleted dummy component

export const customerRoutes = createBrowserRouter([
    // Public Welcome Page (Handles both Auth and Guest states internally)
    {
        path: "/",
        element: (
            <Layout>
                <HomePage />
            </Layout>
        ),
    },

    // Unauthenticated (Guest) Routes
    {
        element: <CustomerGuestGuard />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ],
    },

    // Authenticated App Flow
    {
        element: <CustomerAuthGuard />,
        children: [
            {
                element: (
                    <Layout>
                        <Outlet />
                    </Layout>
                ),
                children: [
                    { path: "/profile", element: <ProfilePage /> },
                    { path: "/edit-profile", element: <EditProfilePage /> },
                    { path: "/saved", element: <SavedDataPage /> },
                    { path: "/change-password", element: <div className="p-4 text-white">Change Password</div> },

                    // Bookings Engine
                    { path: "/bookings", element: <BookingPage /> },
                    { path: "/history", element: <HistoryPage /> },
                    { path: "/booking-confirmation", element: <div className="p-4 text-white">Booking Confirmation</div> }
                ],
            },
        ],
    },

    // 🚫 SECURE THE BOUNDARY: Fallback for /admin inside Customer PWA Mode
    {
        path: "/admin/*",
        element: (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white">
                <h2 className="text-2xl font-bold mb-4">403 Forbidden</h2>
                <p className="text-zinc-400 mb-6 text-center max-w-sm">
                    The Admin Dashboard cannot be loaded within the Customer Application framework.
                </p>
                <button
                    onClick={() => window.location.href = "/"}
                    className="px-6 py-2 bg-indigo-600 rounded-xl font-medium"
                >
                    Return Home
                </button>
            </div>
        )
    },

    // 404 Catch-All
    {
        path: "*",
        element: <div className="p-8 text-center mt-20 text-white">Route Not Found</div>,
    }
]);
