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

const CreateTaskDailog = ({ open, setOpen, initialData }) => {
  const [loading, setLoading] = useState(false);
  const { createTask, getAllTasks } = useTaskStore();
  const { workspaceId, projectId } = useParams();

  const handleCreateTask = async (data) => {
    setLoading(true);
    try {
      await createTask(workspaceId, data.projectId, data);

      toast({
        description: "Task created successfully.",
      });
      if (projectId) {
        await getAllTasks(workspaceId, { projectId });
      } else {
        await getAllTasks(workspaceId);
      }
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setOpen(false);
      setLoading(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || `Failed to create task.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
          <DialogDescription>Add task in your project.</DialogDescription>
        </DialogHeader>
        <DottedSeperator />
        <TaskForm
          initialData={initialData}
          onSubmit={handleCreateTask}
          loading={loading}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
export default CreateTaskDailog;
