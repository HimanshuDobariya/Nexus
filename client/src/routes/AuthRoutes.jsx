import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <DefaultSkeleton />;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
export default AuthRoutes;
