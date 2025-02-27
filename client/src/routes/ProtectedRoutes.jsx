import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet } from "react-router-dom";
import WorkspaceRedirect from "./WorkspaceRedirect";
const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const { workspaces, activeWorkspace } = useWorkspaceStore();

  if (loading) return <DefaultSkeleton />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <WorkspaceRedirect />;
};
export default ProtectedRoutes;
