import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "./store/authStore";
import type { AuthState } from "./store/authStore";

export default function ProtectedRoute() {
  const token = useAuthStore((s: AuthState) => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
