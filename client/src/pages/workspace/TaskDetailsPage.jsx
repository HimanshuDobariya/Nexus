import Header from "@/components/common/Header";
import TaskDetails from "@/components/tasks/details/TaskDetails";
import EditTaskCard from "@/components/tasks/forms/EditTaskCard";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/store/taskStore";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const TaskDetailsPage = () => {
  const location = useLocation();
  const [projectId, setProjectId] = useState(location.state?.projectId);
  const [loading, setLoading] = useState(false);
  const { getTaskById } = useTaskStore();
  const [taskData, setTaskData] = useState();
  const { taskId, workspaceId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="w-full max-w-screen-2xl mx-auto">
      <Header
        title={
          <div className="flex items-center gap-x-4 mt-2 mb-6">
            <p className="text-xl lg:text-2xl font-semibold">
              {taskData?.title}
            </p>
            <Badge className="text-sm" variant="secondary">
              {taskData?.taskCode}
            </Badge>
          </div>
        }
      />
      <div
        className={`grid gap-4 items-start ${
          isEditing ? "lg:grid-cols-[4fr_3fr]" : "grid-cols-1"
        }`}
      >
        <TaskDetails task={taskData} setIsEditing={setIsEditing} />
        {isEditing && (
          <div className="row-span-3 border rounded-lg">
            <EditTaskCard
              task={taskData}
              setIsEditing={setIsEditing}
              setProjectId={setProjectId}
            />
          </div>
        )}
        <div>Comment section</div>
      </div>
    </div>
  );
};
export default TaskDetailsPage;
