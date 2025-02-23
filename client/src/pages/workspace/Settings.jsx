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
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { deleteWorkspace, activeWorkspace, loading } = useWorkspaceStore();
  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspace(activeWorkspace?._id);
      navigate("/");
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
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className="max-w-screen-sm mx-auto space-y-4">
      <Card className="w-full">
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

      <Card className="w-full max-w-screen-sm mx-auto">
        <CardHeader className="pb-2">
          <CardTitle>Delete Workspace</CardTitle>
          <CardDescription>
            Deleting a workspace is irreversible remove all associted data
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-5 flex justify-end">
          <Button
            onClick={() => {
              setOpen(true);
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
        open={open}
        onOpenChange={setOpen}
        handleConfirm={handleDeleteWorkspace}
        handleCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};
export default Settings;
