import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/public/Home";
import AuthLayout from "./layouts/AuthLayout";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { ToastContainer, Slide } from "react-toastify";
import ResetPassword from "./pages/auth/ResetPassword";
import WorkSpaceLayout from "./layouts/WorkSpaceLayout";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated && !user) {
    return <Navigate to="/signup" />;
  }
  return children;
};

const App = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth, isAuthenticated]);

  return (
    <>
      {" "}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <WorkSpaceLayout />
              </ProtectedRoute>
            }
            path="/workspace"
          />
        </Routes>
      </Router>
    </>
  );
};
export default App;
