import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { authenticated, loading } = useAuth();

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
}