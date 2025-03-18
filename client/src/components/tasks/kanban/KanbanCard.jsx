import { getAvatarColor } from "@/components/avatar/getAvatarColor";
import { getAvatarFallbackText } from "@/components/avatar/getAvatarFallback";
import DottedSeperator from "@/components/common/DottedSeperator";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import TaskAction from "../TaskAction";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Flag, MoreHorizontal, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import TaskDetailsDilalog from "../details/TaskDetailsDilalog";

const KanbanCard = ({ task }) => {
  const avatarFallbakText = getAvatarFallbackText(task?.assignedTo?.name);
  const avatarColor = getAvatarColor(task?.assignedTo?.name || "");
  const { projectId: paramsProjectId } = useParams();
  const [openTaskDetailsDialod, setOpenTaskDetailsDailog] = useState(false);

  const formatDate = (date) => {
    if (!date) return;
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <>
      <div
        className={clsx(
          "bg-white border-l-4 border-1 p-2.5 mb-1.5 rounded shadow-sm space-y-3",
          {
            "border-green-500": task.status === "DONE",
            "border-pink-400": task.status === "BACKLOG",
            "border-red-400": task.status === "TODO",
            "border-yellow-400": task.status === "IN_PROGRESS",
            "border-emerald-400": task.status === "IN_REVIEW",
          }
        )}
      >
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="seconadary" className="text-xs text-gray-500">
              {task.taskCode}
            </Badge>
            <TaskAction data={task}>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <MoreHorizontal />
                <span className="sr-only">Open menu</span>
              </Button>
            </TaskAction>
          </div>
          <h3
            onClick={() => {
              setOpenTaskDetailsDailog(true);
            }}
            className="text-lg font-medium hover:underline cursor-pointer"
          >
            {task.title}
          </h3>
          <DottedSeperator />
        </div>

        <div className="flex items-center justify-between gap-x-2">
          {!paramsProjectId && (
            <div className="flex items-center space-x-2 text-gray-600">
              {<span>{task.project.emoji}</span>}
              <span className="font-medium">{task.project.name}</span>
            </div>
          )}

          {task.priority && (
            <div className="flex items-center space-x-2 text-sm text-red-500 font-medium">
              <Badge variant="secondary">{task.priority}</Badge>
            </div>
          )}
        </div>

        {task.dueDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}

        {task.assignedTo && (
          <div className="flex items-center justify-end space-x-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">{task.assignedTo?.name}</span>
            </div>
            <Avatar className="size-8">
              <AvatarFallback
                className={`${avatarColor} rounded-full p-1 w-full h-full flex items-center justify-center`}
              >
                {avatarFallbakText}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      <TaskDetailsDilalog
        open={openTaskDetailsDialod}
        setOpen={setOpenTaskDetailsDailog}
        taskId={task?._id}
        projectId={task?.project._id}
      />
    </>
  );
};
export default KanbanCard;
