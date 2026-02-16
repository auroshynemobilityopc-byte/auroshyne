import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../../lib/apiClient/authStorage";

export const GuestGuard = () => {
    const token = getAccessToken();
    return token ? <Navigate to="/admin" replace /> : <Outlet />;
};
