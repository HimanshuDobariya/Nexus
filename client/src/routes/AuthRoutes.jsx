import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  const { workspaces, currentWorkspace } = useWorkspaceStore();

  if (isAuthenticated) {
    return workspaces.length === 0 ? (
      <Navigate to="/workspace/create" replace />
    ) : (
      <Navigate to={`/workspace/${currentWorkspace._id}`} replace />
    );
  }

  return <Outlet />;
};
export default AuthRoutes;
