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
import UserProfile from "@/pages/profile/UserProfile";
import WorkspaceFormCard from "@/components/workspace/WorkspaceFormCard";
import Settings from "@/pages/workspace/Settings";
import Members from "@/pages/workspace/Members";
import JoinWorkspace from "@/components/invitation/JoinWorkspace";
import Dashboard from "@/pages/workspace/Dashboard";
import ProjectDetails from "@/pages/workspace/ProjectDetails";
import Tasks from "@/pages/workspace/Tasks";
// import TaskDetails from "@/components/tasks/details/TaskDetails";
// import TaskDetailsPage from "@/pages/workspace/TaskDetailsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<AuthRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/workspaces/create" element={<WorkspaceFormCard />} />
          <Route path="/workspaces/:workspaceId" element={<WorkspaceLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="settings" element={<Settings />} />
            {/* <Route path="tasks" element={<Tasks />} /> */}
            <Route path="profile" element={<UserProfile />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            {/* <Route path="tasks/:taskId" element={<TaskDetailsPage />} /> */}
          </Route>
        </Route>
        <Route
          path="workspaces/:workspaceId/join/:inviteCode"
          element={<JoinWorkspace />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
