import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const {
    getWorkSpaces,
    workspaces,
    loading: workspaceLoading,
    activeWorkspace,
  } = useWorkspaceStore();

  useEffect(() => {
    getWorkSpaces();
  }, [getWorkSpaces]);

  if (authLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (location.pathname === "/") {
    if (workspaces.length === 0) {
      return <Navigate to="workspaces/create" replace />;
    } else if (activeWorkspace) {
      return <Navigate to={`workspaces/${activeWorkspace._id}`} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoutes;
