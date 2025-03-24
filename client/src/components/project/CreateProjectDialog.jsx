import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";
import DottedSeperator from "../common/DottedSeperator";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useProjectStore } from "@/store/projectStore";

const CreateProjectDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { createProject, getAllProjects } = useProjectStore();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const project = await createProject(workspaceId, data);
      await getAllProjects(workspaceId);
      navigate(`/workspaces/${workspaceId}/projects/${project._id}`);
      toast({
        variant: "success",
        description: "Project created successfully.",
      });
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setOpen(false);
      setLoading(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Failed to create project",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create new project and manage with timeline
          </DialogDescription>
        </DialogHeader>

        <DottedSeperator />

        <ProjectForm
          onSubmit={onSubmit}
          loading={loading}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
export default CreateProjectDialog;
