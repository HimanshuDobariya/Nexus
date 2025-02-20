import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { isAuthenticated, loading } = useAuthStore();
  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
export default AuthRoutes;
