import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import AuthRoutes from "./AuthRoutes";
import { authenticationRoutePaths, publicRoutePaths } from "./RoutePaths";
import MainLayout from "@/layout/MainLayout";
import WorkspaceLayout from "@/layout/WorkspaceLayout";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "@/pages/workspace/Dashboard";
import { useCallback, useEffect } from "react";
import UserProfile from "@/pages/profile/UserProfile";
import CreateWorkspace from "@/pages/workspace/CreateWorkspace";
import WorkspaceForm from "@/components/common/WorkspaceForm";
import { useWorkspaceStore } from "@/store/workspaceStore";

const AppRoutes = () => {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { getWorkSpaces } = useWorkspaceStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    getWorkSpaces();
  }, [getWorkSpaces, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {publicRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<AuthRoutes />}>
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
          <Route path="/workspace/create" element={<CreateWorkspace />} />
          <Route path="/workspace/:id" element={<WorkspaceLayout />}>
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
