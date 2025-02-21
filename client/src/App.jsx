import { useEffect } from "react";
import AppRoutes from "./routes/Index";
import { useAuthStore } from "./store/authStore";
import { useWorkspaceStore } from "./store/workspaceStore";

const App = () => {
  const { checkAuth } = useAuthStore();
  const { getWorkSpaces } = useWorkspaceStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    getWorkSpaces();
  }, [getWorkSpaces]);

  return <AppRoutes />;
};
export default App;
