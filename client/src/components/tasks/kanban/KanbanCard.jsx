import DottedSeperator from "@/components/common/DottedSeperator";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import TaskAction from "../TaskAction";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";

const KanbanCard = ({ task }) => {
  const avatarFallbakText = getAvatarFallbackText(task?.assignedTo?.name);
  const avatarColor = getAvatarColor(task?.assignedTo?.name || "");

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
            "border-blue-400": task.status === "IN_REVIEW",
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
          <h3 className="text-lg font-medium ">{task.title}</h3>
          <DottedSeperator />
        </div>

        {task.priority && (
          <div className="flex items-center space-x-2 text-sm text-red-500 font-medium">
            <Badge variant="secondary">{task.priority}</Badge>
          </div>
        )}

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
    </>
  );
};
export default KanbanCard;
