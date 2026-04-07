// src/api/client.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
} from "../auth/authStorage";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            getRefreshToken()
        ) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/",
                    {
                        refresh: getRefreshToken(),
                    }
                );

                setTokens({
                    access: response.data.access,
                    refresh: getRefreshToken()!,
                });

                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch {
                clearTokens();
                window.location.href = "/signin";
            }
        }

        return Promise.reject(error);
    }
);

export default api;