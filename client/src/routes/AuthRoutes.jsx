import DefaultSkeleton from "@/components/skeleton/DefaultSkeleton";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const AuthRoutes = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const navigate = useNavigate();
  const { setActiveWorkspace } = useWorkspaceStore();
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const checkPendingInvitation = async () => {
      const pending = localStorage.getItem("pendingInvitation");
      if (pending && isAuthenticated) {
        const { inviteCode, invitationId, workspaceId } = JSON.parse(pending);

        try {
          setIsAccepting(true);
          const { data } = await axios.post(
            `${
              import.meta.env.VITE_SERVER_URL
            }/api/members/workspace/${inviteCode}/join/${invitationId}`
          );
          await setActiveWorkspace(workspaceId);
          setIsAccepting(false);
          toast({
            description: data.message,
          });
          navigate(`/workspaces/${workspaceId}`);
        } catch (error) {
          setIsAccepting(false);
          console.log(error);
          toast({
            variant: "destructive",
            description:
              error.response?.data.message || "Error in accepting invitation",
          });
        } finally {
          localStorage.removeItem("pendingInvitation");
        }
      }
    };

    checkPendingInvitation();
  }, [isAuthenticated]);

  if (loading || isAccepting) return <DefaultSkeleton />;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
export default AuthRoutes;
