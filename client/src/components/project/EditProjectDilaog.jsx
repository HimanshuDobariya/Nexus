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
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useProjectStore } from "@/store/projectStore";

const EditProjectDilaog = ({ open, setOpen, initialData }) => {
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams();
  const { updateProject, getAllProjects } = useProjectStore();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateProject(initialData._id, workspaceId, data);
      await getAllProjects(workspaceId);
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
        description: error.response?.data.message || "Failed to Upadet project",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>Update Project Data</DialogDescription>
        </DialogHeader>

        <DottedSeperator />

        <ProjectForm
          onSubmit={onSubmit}
          initialData={initialData}
          loading={loading}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
export default EditProjectDilaog;
