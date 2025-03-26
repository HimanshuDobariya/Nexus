import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const WorkspaceRedirect = () => {
  
  const location = useLocation();

  if (loading) return <DefaultSkeleton />;

  // ✅ Allow deep linking (do not redirect if accessing /tasks/:taskId directly)
  const isAtRoot = location.pathname === "/";

  if (isAtRoot) {
    if (workspaces.length === 0 && !activeWorkspace) {
      return <Navigate to="/workspaces/create" replace />;
    }
    if (activeWorkspace) {
      return <Navigate to={`/workspaces/${activeWorkspace}`} replace />;
    }
  }

  return <Outlet />;
};

export default WorkspaceRedirect;
