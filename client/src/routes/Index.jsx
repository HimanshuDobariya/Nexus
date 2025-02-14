import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import AuthRoutes from "./AuthRoutes";
import { authenticationRoutePaths, publicRoutePaths } from "./RoutePaths";
import MainLayout from "@/layout/MainLayout";
import WorkspaceLayout from "@/layout/WorkspaceLayout";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "@/pages/workspace/Dashboard";
import { useEffect } from "react";
import UserProfile from "@/pages/profile/UserProfile";

const AppRoutes = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {publicRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="/" element={<AuthRoutes />}>
          <Route element={<AuthLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/:username/workspace" element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
