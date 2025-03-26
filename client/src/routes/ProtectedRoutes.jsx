import { Navigate, Outlet, useLocation } from "react-router-dom";
import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const { workspaces, getWorkSpaces, activeWorkspaceId } = useWorkspaceStore();
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setWorkspaceLoading(true);
        await getWorkSpaces();
        setWorkspaceLoading(false);
      } catch (error) {
        setWorkspaceLoading(false);
      }
    };

    fetchWorkspaces();
  }, [getWorkSpaces]);

  // ✅ Show loading state while fetching user or workspaces
  if (authLoading || workspaceLoading) {
    return <DefaultSkeleton />;
  }

  // ✅ If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Get active workspace from localStorage or store
  const activeWorkspace =
    activeWorkspaceId || localStorage.getItem("activeWorkspaceId");

  // ✅ Redirect Logic (Only When Necessary)
  if (!activeWorkspace && workspaces.length === 0) {
    if (location.pathname !== "/workspaces/create") {
      return <Navigate to="/workspaces/create" replace />;
    }
  } else if (activeWorkspace) {
    if (!location.pathname.startsWith(`/workspaces/${activeWorkspace}`)) {
      return <Navigate to={`/workspaces/${activeWorkspace}`} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoutes;
