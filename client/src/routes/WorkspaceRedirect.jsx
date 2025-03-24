import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const WorkspaceRedirect = () => {
  const { workspaces, activeWorkspaceId, loading } = useWorkspaceStore();
  const activeWorkspace = localStorage.getItem("activeWorkspaceId") || activeWorkspaceId
  const location = useLocation();

  if (loading) return <DefaultSkeleton />;

  if (location.pathname === "/") {
    if (workspaces.length === 0 && !activeWorkspace) {
      return <Navigate to="/workspaces/create" />;
    }
    if (activeWorkspace) {
      return <Navigate to={`/workspaces/${activeWorkspace}`} replace />;
    }
  }

  return <Outlet />;
};
export default WorkspaceRedirect;
