import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DottedSeperator from "@/components/common/DottedSeperator";
import WorkspaceForm from "@/components/common/WorkspaceForm";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ConfirmationDilog from "@/components/common/ConfirmationDilog";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Copy, Loader } from "lucide-react";
import axios from "axios";

const Settings = () => {
  const [openWorkspaceDeleteDiolg, setOpenWorkspaceDeleteDiolg] =
    useState(false);
  const [openResetLinkDilog, SetOpenResetLinkDilog] = useState(false);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { deleteWorkspace, activeWorkspace, loading } = useWorkspaceStore();
  const { workspaceId } = useParams();
  const baseInviteUrl = `${window.location.origin}/workspaces/${workspaceId}/join`;
  const [inviteLink, setInviteLink] = useState(
    `${baseInviteUrl}/${activeWorkspace?.inviteCode}`
  );

  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspace(workspaceId);
      navigate(`/workspaces/${activeWorkspace._id}`);
      toast({
        description: "Workspace deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || `Failed to delete workspace`,
      });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    toast({
      description: "Invite link copied to clipboard.",
    });
  };

  const handleResetInviteCode = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/workspaces/${workspaceId}/reset-invite`
      );
      toast({
        description: "Invite code reset successfully.",
      });
      setIsLoading(false);
      setInviteLink(`${baseInviteUrl}/${data.newInviteCode}`);
      SetOpenResetLinkDilog(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.error || "Failed to reset invite code",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto space-y-4">
      <Card className="w-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">
            Update your workspace
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent className="p-7">
          <WorkspaceForm
            mode="edit"
            initialData={activeWorkspace}
            setOpen={() => {
              return null;
            }}
          />
        </CardContent>
      </Card>

      <Card className="w-full border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle>Invite Members</CardTitle>
          <CardDescription>
            Use the invite link to add members to your workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center gap-4">
          <Input readOnly value={inviteLink} className="text-neutral-500" />
          <Button
            variant="outline"
            size="icon"
            className="size-12"
            onClick={handleCopy}
            disabled={isLoading}
          >
            <Copy />
          </Button>
        </CardContent>

        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent className="mt-5 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              SetOpenResetLinkDilog(true);
            }}
            disabled={isLoading}
          >
            Reset Invite Link
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle>Delete Workspace</CardTitle>
          <CardDescription>
            {" "}
            Deleting a workspace is irreversible and remove all associted data
          </CardDescription>
        </CardHeader>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent className="mt-5 flex justify-end">
          <Button
            onClick={() => {
              setOpenWorkspaceDeleteDiolg(true);
            }}
            variant="destructive"
            size="sm"
          >
            Delete Workspace
          </Button>
        </CardContent>
      </Card>

      <ConfirmationDilog
        title="Delete Workspace"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        open={openWorkspaceDeleteDiolg}
        onOpenChange={setOpenWorkspaceDeleteDiolg}
        handleConfirm={handleDeleteWorkspace}
        handleCancel={() => {
          setOpenWorkspaceDeleteDiolg(false);
        }}
        loading={loading}
      />

      <ConfirmationDilog
        title="Reset Invite Link"
        description="This will invalidate the current invite link"
        open={openResetLinkDilog}
        onOpenChange={SetOpenResetLinkDilog}
        handleConfirm={handleResetInviteCode}
        handleCancel={() => {
          SetOpenResetLinkDilog(false);
        }}
        loading={isLoading}
      />
    </div>
  );
};
export default Settings;
