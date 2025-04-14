import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [taskData, setTaskData] = useState();
  const { projectId, workspaceId, taskId } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTaskData = async () => {
      if (!taskId) return;
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

    getTaskData();
  }, [taskId, tasks]);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to={`/workspaces/${taskData?.workspace}/projects/${taskData?.project._id}`}
                className="flex items-center gap-1"
              >
                <span>{taskData?.project.emoji}</span>
                {taskData?.project.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BreadcrumbLink href="">
                    <Badge className="bg-transparent h-5 font-normal text-primary shadow-none border-neutral-300 hover:bg-neutral-100">
                      {taskData?.taskCode}
                    </Badge>
                  </BreadcrumbLink>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p>
                    {taskData?.taskCode} : {taskData?.title}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-6">
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <div>
            <TaskDetails task={taskData} />
            <CommentsSection id={taskId} />
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskDetailsPage;
