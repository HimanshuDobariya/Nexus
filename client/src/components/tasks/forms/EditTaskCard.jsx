import DottedSeperator from "@/components/common/DottedSeperator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaskForm from "./TaskForm";
import { useTaskStore } from "@/store/taskStore";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const EditTaskCard = ({ task, setIsEditing, setProjectId }) => {
  const { updateTask } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams();

  const handleEditTask = async (data) => {
    setProjectId(data.projectId);
    setLoading(true);
    try {
      await updateTask(workspaceId, task.project._id, task._id, data);
      toast({
        description: "Task update successfully.",
      });
      setLoading(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsEditing(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || `Failed to update task.`,
      });
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardContent className="p-6">
        <CardHeader className="p-0">
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Update your task data.</CardDescription>
        </CardHeader>
        <DottedSeperator className="my-4" />

        <TaskForm
          onSubmit={handleEditTask}
          loading={loading}
          onCancel={() => {
            setIsEditing(false);
          }}
          mode="edit"
          initialData={task}
        />
      </CardContent>
    </Card>
  );
};
export default EditTaskCard;
