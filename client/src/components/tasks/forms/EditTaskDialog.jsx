import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "./TaskForm";
import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import DottedSeperator from "@/components/common/DottedSeperator";

const EditTaskDialog = ({ open, setOpen, initialData }) => {
  const [loading, setLoading] = useState(false);
  const { updateTask, getAllTasks } = useTaskStore();
  const { workspaceId, projectId } = useParams();

  const handleEditTask = async (data) => {
    setLoading(true);
    try {
      await updateTask(
        workspaceId,
        projectId || initialData?.project._id,
        initialData._id,
        data
      );
      toast({
        description: "Task update successfully.",
      });
      if (projectId) {
        await getAllTasks(workspaceId, { projectId });
      } else {
        await getAllTasks(workspaceId);
      }
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
      setOpen(false);
      setLoading(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || `Failed to update task.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update your task data.</DialogDescription>
        </DialogHeader>

        <DottedSeperator />

        <TaskForm
          onSubmit={handleEditTask}
          loading={loading}
          onCancel={() => {
            setOpen(false);
          }}
          mode="edit"
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};
export default EditTaskDialog;
