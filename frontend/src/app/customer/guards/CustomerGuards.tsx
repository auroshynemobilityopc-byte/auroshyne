import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../CustomerAuthContext";

export const CustomerAuthGuard = () => {
    const { isAuthenticated, isLoading } = useCustomerAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>; // Or a nice PWA skeleton
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
};

export const CustomerGuestGuard = () => {
    const { isAuthenticated, isLoading } = useCustomerAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (isAuthenticated) {
        const from = location.state?.from || "/";
        return <Navigate to={from} replace />; // Redirect logged-in users away from /login
    }

    return <Outlet />;
};
