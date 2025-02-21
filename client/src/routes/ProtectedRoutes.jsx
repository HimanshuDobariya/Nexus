import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const { currentWorkspace } = useWorkspaceStore();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/") {
    if (currentWorkspace?._id) {
      return <Navigate to={`/workspaces/${currentWorkspace._id}`} replace />;
    }

    return <Navigate to="/workspaces/create" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoutes;
