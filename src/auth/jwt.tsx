import { jwtDecode } from "jwt-decode";
import { User } from "../components/tables/UsersTable";
import { getAccessToken } from "./authStorage";

export type DecodedToken = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    exp: number;
};

export function decodeToken(token: string): DecodedToken | null {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch {
        return null;
    }
}

export const getCurrentUserFromToken = (): User | null => {
    const token = getAccessToken();
    if (!token) return null;

    try {
        const decodedUser = jwtDecode<DecodedToken>(token);
        return decodedUser;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};