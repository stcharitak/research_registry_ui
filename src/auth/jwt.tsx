import { jwtDecode } from "jwt-decode";

export type DecodedToken = {
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