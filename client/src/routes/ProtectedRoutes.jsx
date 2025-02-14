import { useAuthStore } from "@/store/authStore";
import { useNavigationStore } from "@/store/useNavigationStore";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const { setLastVisitedRoute } = useNavigationStore();

  useEffect(() => {
    if (isAuthenticated) {
      setLastVisitedRoute(location.pathname); // Store last visited route safely
    }
  }, [location.pathname, isAuthenticated, setLastVisitedRoute]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoutes;
