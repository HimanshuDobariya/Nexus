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

const TaskDetailsDilalog = ({ open, setOpen, taskId }) => {
  const { getTaskById, tasks } = useTaskStore();
  const [taskData, setTaskData] = useState();
  const { projectId, workspaceId } = useParams();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[90vh] min-h-[90vh] max-w-screen-xl overflow-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <div className="flex items-center gap-1">
                      <span>{taskData?.project.emoji}</span>
                      {taskData?.project.name}
                    </div>
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
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <TaskDetails task={taskData} />
              <CommentsSection id={taskId} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default TaskDetailsDilalog;
