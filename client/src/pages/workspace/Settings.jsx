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

const Settings = () => {
  const [openWorkspaceDeleteDiolg, setOpenWorkspaceDeleteDiolg] =
    useState(false);

  const navigate = useNavigate();
  const { deleteWorkspace, activeWorkspace, loading } = useWorkspaceStore();
  const { workspaceId } = useParams();

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

  return (
    <div className="max-w-screen-sm mx-auto space-y-2">
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
    </div>
  );
};
export default Settings;
