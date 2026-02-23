import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import {
    getCustomerToken,
    setCustomerToken,
    clearCustomerToken,
    getCustomerRefreshToken,
    setCustomerRefreshToken
} from "./customerStorage";

export const customerApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // We reuse VITE_API_URL, but endpoints must be explicitly separate
});

// Attach ONLY the Customer token, never the Admin token.
customerApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getCustomerToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;

type QueueItem = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let queue: QueueItem[] = [];

customerApi.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // ── Skip refresh logic for auth endpoints ──
        // A 401 from /auth/login means wrong credentials, NOT an expired token.
        // Trying to refresh here would fail and cause a page reload via window.location.href.
        const isAuthEndpoint = originalRequest?.url?.includes('/login') ||
            originalRequest?.url?.includes('/register');

        if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(customerApi(originalRequest));
                        },
                        reject,
                    });
                });
            }
            isRefreshing = true;

            try {
                const refreshToken = getCustomerRefreshToken();
                if (!refreshToken) throw new Error("No refresh token available");

                // Call the refresh endpoint
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                const { accessToken: newToken, refreshToken: newRefreshToken } = response.data.data;

                if (!newToken || !newRefreshToken) {
                    throw new Error("Invalid token refresh response");
                }

                setCustomerToken(newToken);
                setCustomerRefreshToken(newRefreshToken);

                queue.forEach((p) => p.resolve(newToken));
                queue = [];

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return customerApi(originalRequest);
            } catch (err) {
                queue.forEach((p) => p.reject(err));
                queue = [];

                clearCustomerToken();
                localStorage.removeItem("customerUser");

                // Only redirect if user was previously logged in
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
