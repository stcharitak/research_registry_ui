// src/auth/authService.ts

import api from "../api/client";
import { setTokens, clearTokens, getAccessToken, Tokens } from "./authStorage";

export async function login(
    username: string,
    password: string
): Promise<Tokens> {
    const response = await api.post<Tokens>("/api/token/", {
        username,
        password,
    });

    setTokens(response.data);
    return response.data;
}

export function logout(): void {
    clearTokens();
}

export function isAuthenticated(): boolean {
    return !!getAccessToken();
}