import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../services/authStore.js";
import { Loader2 } from "lucide-react";

/**
 * Route protection wrapper component.
 * Redirects unauthenticated users to the login route.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
