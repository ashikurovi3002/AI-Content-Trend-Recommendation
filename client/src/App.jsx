import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./services/authStore.js";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Sources from "./pages/Sources.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/**
 * Main application component configuring React Router paths.
 */
export default function App() {
  const { checkAuth, user } = useAuthStore();

  // Verify token validation on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Core Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Overview / Welcome Placeholder page (Dashboard is out of scope for Phase 3) */}
            <Route
              path="/"
              element={
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm max-w-xl space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
                    TP
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
                    Welcome back, {user?.name || "User"}!
                  </h1>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Source Management features are fully initialized. Click on the{" "}
                    <strong>Sources</strong> navigation link in the sidebar to configure website
                    feeds and YouTube channels.
                  </p>
                </div>
              }
            />
            {/* Source Management View */}
            <Route path="/sources" element={<Sources />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
