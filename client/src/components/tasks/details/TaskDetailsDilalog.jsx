import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskDetails from "./TaskDetails";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import EditTaskCard from "../forms/EditTaskCard";
import { useParams } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { Loader } from "lucide-react";

const TaskDetailsDilalog = ({
  open,
  setOpen,
  taskId,
  projectId: propsProjectId,
}) => {
  const [projectId, setProjectId] = useState(propsProjectId);
  const [loading, setLoading] = useState(false);
  const { getTaskById } = useTaskStore();
  const { workspaceId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState();
  const getTaskData = async () => {
    setLoading(true);
    try {
      const data = await getTaskById(workspaceId, projectId, taskId);
      setTaskData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      getTaskData();
    }
  }, [isEditing]);

  if (loading) return <Loader className="animate-spin size-8 mx-auto" />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[90vh] max-w-screen-xl overflow-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-x-4 mt-2 mb-6">
              <p className="text-xl lg:text-2xl font-semibold">
                {taskData?.title}
              </p>
              <Badge className="text-sm" variant="secondary">
                {taskData?.taskCode}
              </Badge>
            </div>
          </DialogTitle>

          <div
            className={`grid gap-4 items-start ${
              isEditing ? "lg:grid-cols-[4fr_3fr]" : "grid-cols-1"
            }`}
          >
            <TaskDetails task={taskData} setIsEditing={setIsEditing} />

            {isEditing && (
              <div className="row-span-2 w-full lg:max-h-[600px] overflow-auto border rounded-lg h-max">
                <EditTaskCard
                  task={taskData}
                  setIsEditing={setIsEditing}
                  setProjectId={setProjectId}
                />
              </div>
            )}

            <div className="h-[300px]">Comment section</div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default TaskDetailsDilalog;
