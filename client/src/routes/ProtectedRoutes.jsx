import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const {
    activeWorkspace,
    workspaces,
    loading: workspaceLoading,
  } = useWorkspaceStore();
  const location = useLocation();

  if (authLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (location.pathname === "/" && !workspaceLoading) {
    if (workspaces.length === 0) {
      return <Navigate to="/workspaces/create" replace />;
    }

    if (activeWorkspace) {
      return <Navigate to={`/workspaces/${activeWorkspace._id}`} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoutes;
