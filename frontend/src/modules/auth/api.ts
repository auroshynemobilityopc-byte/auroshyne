import { api } from "../../lib/apiClient/axios";
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenResponse,
    LogoutResponse,
    ChangePasswordRequest,
} from "./types";

export const loginApi = async (data: LoginRequest) => {
    const res = await api.post<LoginResponse>("/auth/login", data);
    return res.data.data;
};

export const refreshTokenApi = async (): Promise<{
    accessToken: string;
    refreshToken: string;
}> => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("No refresh token");
    }
    try {
        const res = await api.post<RefreshTokenResponse>(
            "/auth/refresh-token",
            { refreshToken }
        );
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const logoutApi = async () => {
    const res = await api.post<LogoutResponse>("/auth/logout");
    return res.data;
};

export const changePasswordApi = async (data: ChangePasswordRequest) => {
    const res = await api.patch("/auth/change-password", data);
    return res.data;
};
