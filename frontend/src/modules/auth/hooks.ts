import { useMutation } from "@tanstack/react-query";
import { loginApi, logoutApi, changePasswordApi } from "./api";
import {
    setAccessToken,
    clearAccessToken,
} from "../../lib/apiClient/authStorage";

export const useLogin = () =>
    useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
        },
    });

export const useLogout = () =>
    useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            clearAccessToken();
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/admin/login";
        },
    });

export const useChangePassword = () =>
    useMutation({
        mutationFn: changePasswordApi,
        onSuccess: () => {
            clearAccessToken();
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/admin/login";
        },
    });
