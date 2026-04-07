// src/auth/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "./authService";

type AuthContextType = {
    authenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setAuthenticated(authService.isAuthenticated());
        setLoading(false);
    }, []);

    async function login(username: string, password: string) {
        await authService.login(username, password);
        setAuthenticated(true);
    }

    function logout() {
        authService.logout();
        setAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ authenticated, loading, login, logout }}>
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