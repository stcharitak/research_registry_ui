// src/auth/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "./authService";
import { decodeToken, DecodedToken } from "./jwt";
import { getAccessToken } from "./authStorage";

type AuthContextType = {
    authenticated: boolean;
    loading: boolean;
    user: DecodedToken | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const token = getAccessToken();

        if (token) {
            const decoded = decodeToken(token);
            setUser(decoded);
            setAuthenticated(true);
        }

        setLoading(false);
    }, []);

    async function login(username: string, password: string) {
        const tokens = await authService.login(username, password);

        const decoded = decodeToken(tokens.access);
        setUser(decoded);
        setAuthenticated(true);
    }

    function logout() {
        authService.logout();
        setUser(null);
        setAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ authenticated, loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}