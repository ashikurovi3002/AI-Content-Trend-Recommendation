import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./services/authStore.js";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Sources from "./pages/Sources.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/**
 * Main application component configuring React Router paths.
 */
export default function App() {
  const { checkAuth } = useAuthStore();

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
            {/* Overview Dashboard View */}
            <Route path="/" element={<Dashboard />} />
            {/* Source Management View */}
            <Route path="/sources" element={<Sources />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
