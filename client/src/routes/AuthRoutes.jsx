import { useAuthStore } from "@/store/authStore";
import { useNavigationStore } from "@/store/useNavigationStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { lastVisitedRoute } = useNavigationStore();

  const username = user?.email.split("@")[0];

  if (isAuthenticated) {
    return (
      <Navigate to={lastVisitedRoute || `/${username}/workspace`} replace />
    );
  }

  return <Outlet />;
};
export default AuthRoutes;
