import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";
import WorkspaceRedirect from "./WorkspaceRedirect";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useEffect } from "react";
const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const { getWorkSpaces } = useWorkspaceStore();
  useEffect(() => {
    getWorkSpaces();
  }, [getWorkSpaces]);

  if (loading) return <DefaultSkeleton />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <WorkspaceRedirect />;
};
export default ProtectedRoutes;
