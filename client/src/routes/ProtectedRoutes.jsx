import { Navigate, Outlet, useLocation } from "react-router-dom";
import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const { workspaces, getWorkSpaces, activeWorkspaceId } = useWorkspaceStore();
  const [workspaceLoading, setWorkspaceLoading] = useState(true); // Start as true
  const location = useLocation();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setWorkspaceLoading(true);
        await getWorkSpaces();
      } finally {
        setWorkspaceLoading(false); // Ensure it gets cleared no matter what
      }
    };

    fetchWorkspaces();
  }, [getWorkSpaces]);

  // ✅ Still loading auth or workspaces? Show skeleton.
  if (authLoading || workspaceLoading) {
    return <DefaultSkeleton />;
  }

  // ✅ Auth done loading: now check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const activeWorkspace =
    activeWorkspaceId || localStorage.getItem("activeWorkspaceId");

  if (!activeWorkspace && workspaces.length === 0) {
    if (location.pathname !== "/workspaces/create") {
      return <Navigate to="/workspaces/create" replace />;
    }
  } else if (activeWorkspace) {
    const workspaceBase = `/workspaces/${activeWorkspace}`;
    const isInWorkspace = location.pathname.startsWith(workspaceBase);

    // Only redirect if user is NOT already in a workspace subpath
    const shouldRedirect =
      location.pathname === "/" || location.pathname === "/workspaces";

    if (!isInWorkspace && shouldRedirect) {
      return <Navigate to={workspaceBase} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoutes;
