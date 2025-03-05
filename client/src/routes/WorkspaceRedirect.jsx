import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const WorkspaceRedirect = () => {
  const { workspaces, activeWorkspaceId, loading } = useWorkspaceStore();
  const location = useLocation();

  if (loading) return <DefaultSkeleton />;

  if (location.pathname === "/") {
    if (workspaces.length === 0) {
      return <Navigate to="/workspaces/create" />;
    }
    if (activeWorkspaceId) {
      return <Navigate to={`/workspaces/${activeWorkspaceId}`} replace />;
    }
  }

  return <Outlet />;
};
export default WorkspaceRedirect;
