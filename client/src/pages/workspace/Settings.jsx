import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DottedSeperator from "@/components/common/DottedSeperator";
import WorkspaceForm from "@/components/workspace/WorkspaceForm";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ConfirmationDilog from "@/components/common/ConfirmationDilog";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import Header from "@/components/common/Header";

const Settings = () => {
  const [openWorkspaceDeleteDiolg, setOpenWorkspaceDeleteDiolg] =
    useState(false);

  const navigate = useNavigate();
  const { deleteWorkspace, getWorkspaceById, activeWorkspaceId } =
    useWorkspaceStore();
  const { workspaceId } = useParams();
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWorkspaceCurrentWorkspace = async () => {
    try {
      setLoading(true);
      const workspace = await getWorkspaceById(workspaceId);
      setCurrentWorkspace(workspace);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getWorkspaceCurrentWorkspace();
  }, []);

  const handleDeleteWorkspace = async () => {
    try {
      setLoading(true);
      await deleteWorkspace(workspaceId, navigate);
      toast({
        variant: "success",
        description: "Workspace deleted successfully.",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || `Failed to delete workspace`,
      });
    }
  };

  return (
    <>
      <div className="h-full w-full lg:max-w-screen-sm mx-auto space-y-4">
        <Header
          title=" Workspace settings"
          description="Manage your workspace"
        />
        <Card className="w-full shadow-none">
          <CardHeader className="flex px-7">
            <CardTitle className="text-xl font-bold">
              Update your workspace
            </CardTitle>
          </CardHeader>
          <DottedSeperator className="px-7" />
          <CardContent className="px-7 py-5">
            {loading ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              <WorkspaceForm
                mode="edit"
                initialData={currentWorkspace}
                setOpen={() => {
                  return null;
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="w-full shadow-none">
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
      </div>

      <ConfirmationDilog
        title="Delete Workspace"
        description="Are you sure you want to delete this item? This action cannot be undone"
        confirmText="Delete"
        open={openWorkspaceDeleteDiolg}
        onOpenChange={setOpenWorkspaceDeleteDiolg}
        handleConfirm={handleDeleteWorkspace}
        handleCancel={() => {
          setOpenWorkspaceDeleteDiolg(false);
        }}
        loading={loading}
      />
    </>
  );
};
export default Settings;
