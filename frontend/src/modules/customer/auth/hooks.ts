import { useMutation } from "@tanstack/react-query";
import { login, register, forgotPassword, resetPassword } from "./api";
import { setCustomerRefreshToken } from "../../../app/customer/customerStorage";
import { useCustomerAuth } from "../../../app/customer/CustomerAuthContext";
import toast from "react-hot-toast";

export const useLogin = () => {
    const { login: contextLogin } = useCustomerAuth();
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            const d = data.data;
            if (d?.accessToken) {
                // Update context state so guards react immediately
                contextLogin(d.accessToken, d.user);
                if (d.refreshToken) setCustomerRefreshToken(d.refreshToken);
            }
            toast.success("Login successful!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });
};

export const useRegister = () => {
    const { login: contextLogin } = useCustomerAuth();
    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            const d = data.data;
            // Register returns { token } (not accessToken), no refreshToken
            const token = d?.accessToken || d?.token;
            if (token) {
                contextLogin(token, d.user);
                if (d.refreshToken) setCustomerRefreshToken(d.refreshToken);
            }
            toast.success("Account created! Welcome 🎉");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Registration failed");
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Reset link sent to your email!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send reset link");
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password successfully reset!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to reset password");
        },
    });
};
