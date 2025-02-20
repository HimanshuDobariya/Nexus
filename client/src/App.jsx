import { useEffect } from "react";
import AppRoutes from "./routes/Index";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return <AppRoutes />;
};
export default App;
