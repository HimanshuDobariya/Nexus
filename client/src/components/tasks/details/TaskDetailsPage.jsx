import CommentsSection from "@/components/tasks/comments/CommentsSection";
import TaskDetails from "@/components/tasks/details/TaskDetails";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/store/taskStore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader } from "lucide-react";

const TaskDetailsPage = () => {
  const { getTaskById, tasks } = useTaskStore();
  const [taskData, setTaskData] = useState(null);
  const { taskId, projectId, workspaceId } = useParams();
  const [loading, setLoading] = useState(false);

  const getTaskData = async () => {
    try {
      setLoading(true);
      const data = await getTaskById(workspaceId, projectId, taskId);
      setTaskData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTaskData();
  }, [tasks]);

  return (
    <div className="max-w-screen-2xl mx-auto space-y-6 px-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="group">
              <Link to={`/workspaces/${workspaceId}/projects/${projectId}`}>
                <span className="mr-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  {taskData?.project.emoji}
                </span>
                {taskData?.project.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BreadcrumbLink href="#">
                    <Badge className="bg-transparent h-5 font-normal  text-primary shadow-none border-neutral-300 hover:bg-neutral-100">
                      {taskData?.taskCode}
                    </Badge>
                  </BreadcrumbLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {taskData?.taskCode} : {taskData?.title}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {loading ? (
        <Loader className="animate-spin" />
      ) : (
        <TaskDetails task={taskData} />
      )}
      <CommentsSection />
    </div>
  );
};
export default TaskDetailsPage;
