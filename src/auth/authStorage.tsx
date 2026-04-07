// src/auth/authStorage.ts

export type Tokens = {
    access: string;
    refresh: string;
};

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function setTokens(tokens: Tokens): void {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}