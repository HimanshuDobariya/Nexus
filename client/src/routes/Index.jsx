import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import WorkspaceLayout from "@/layout/WorkspaceLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import AuthRoutes from "./AuthRoutes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<WorkspaceLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
