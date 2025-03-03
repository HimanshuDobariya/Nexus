import DottedSeperator from "@/components/common/DottedSeperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "../../assets/logo.svg";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useAuthStore } from "@/store/authStore";

const JoinWorkspace = () => {
  const { inviteCode, workspaceId } = useParams();
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitationId");
  const [isAccepting, setIsAccepting] = useState(false);
  const navigate = useNavigate();
  const { setActiveWorkspace, getWorkSpaces, activeWorkspace } =
    useWorkspaceStore();
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
    getWorkSpaces();
  }, [checkAuth]);

  const handleRejectInvitation = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/members/reject/${invitationId}`
      );
      toast({
        description: data.message,
      });
      if (activeWorkspace) {
        navigate(`/workspaces/${activeWorkspace._id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!isAuthenticated) {
      // Store the invitation data temporarily
      localStorage.setItem(
        "pendingInvitation",
        JSON.stringify({ inviteCode, invitationId, workspaceId })
      );
      navigate("/login");
      return;
    }

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
          error.response?.data.message || `Error in accept invitation`,
      });
    }
  };

  return (
    <div className="w-full bg-neutral-100 min-h-screen p-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <img src={logo} height={50} width={150} alt="Logo" />
        </Link>{" "}
        <Button asChild variant="primary">
          <Link to="/login">Login</Link>
        </Button>
      </div>
      <Card className="w-full sm:max-w-[500px] mx-auto shadow-none border-none mt-10 lg:mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Join Workspace</CardTitle>
          <CardDescription>
            You have been invited to join workspace.
          </CardDescription>
        </CardHeader>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent className="p-7">
          <p className="text-sm text-center">
            By accepting this invitation, you will gain access to this workspace
            with the role that assigned to you.
          </p>
        </CardContent>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardFooter className="flex items-center justify-between p-7">
          <Button variant="outline" onClick={handleRejectInvitation}>
            Reject Invitation
          </Button>
          <Button onClick={handleAcceptInvitation} disabled={isAccepting}>
            {" "}
            {isAccepting && <Loader className="animate-spin" />} Accept
            workspace
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default JoinWorkspace;
