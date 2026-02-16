import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../../lib/apiClient/authStorage";

export const AuthGuard = () => {
    const token = getAccessToken();
    return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
