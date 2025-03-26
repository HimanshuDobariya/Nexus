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
      await updateTask(workspaceId, projectId, initialData._id, data);
      await getAllTasks(workspaceId, projectId);
      toast({
        variant: "success",
        description: "Task update successfully.",
      });

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
      <DialogContent
        className="sm:max-w-[500px] z-50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
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
