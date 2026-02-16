import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { api } from "./axios";
import {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
} from "./authStorage";
import { refreshTokenApi } from "../../modules/auth/api";

let isRefreshing = false;

type QueueItem = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let queue: QueueItem[] = [];

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest?._retry
        ) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }
            isRefreshing = true;

            try {
                const {
                    accessToken: newToken,
                    refreshToken: newRefreshToken,
                } = await refreshTokenApi();

                if (!newToken || !newRefreshToken) {
                    alert("Session expired : Please login again");
                    clearAccessToken();
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    window.location.href = "/admin/login";
                    return;
                }

                setAccessToken(newToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                queue.forEach((p) => p.resolve(newToken));
                queue = [];

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (err) {
                queue.forEach((p) => p.reject(err));
                queue = [];

                clearAccessToken();
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                window.location.href = "/admin/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
