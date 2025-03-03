import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const WorkspaceRedirect = () => {
  const { workspaces, activeWorkspace, loading } = useWorkspaceStore();
  const location = useLocation();

  if (loading) return <DefaultSkeleton />;

  if (location.pathname === "/") {
    if (workspaces.length === 0) {
      return <Navigate to="/workspaces/create" />;
    }
    if (activeWorkspace) {
      return <Navigate to={`/workspaces/${activeWorkspace._id}`} replace />;
    }
  }

  return <Outlet />;
};
export default WorkspaceRedirect;
