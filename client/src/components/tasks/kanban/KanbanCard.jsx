import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import TaskAction from "../TaskAction";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import TaskDetailsDilalog from "../details/TaskDetailsDilalog";
import { useState } from "react";

const KanbanCard = ({ task }) => {
  const avatarFallbakText = getAvatarFallbackText(task?.assignedTo?.name);
  const avatarColor = getAvatarColor(task?.assignedTo?.name || "");
  const [openTaskDetailsDialod, setOpenTaskDetailsDailog] = useState(false);

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
        <div className="flex gap-3 justify-between">
          <h3
            className="text-sm font-medium hover:underline transition"
            title={task.title}
            onClick={() => {
              setOpenTaskDetailsDailog(true);
            }}
          >
            {task.title.length > 30
              ? task.title.substring(0, 27) + "..."
              : task.title}
          </h3>
          <TaskAction data={task}>
            <Button variant="ghost" className="flex h-8 w-8 p-0 hover:bg-muted">
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </TaskAction>
        </div>
        <div className="flex gap-3 justify-between">
          <Badge variant="seconadary" className="text-gray-600">
            {task.taskCode}
          </Badge>
          {task.assignedTo ? (
            <Avatar className="size-6">
              <AvatarFallback
                title={task?.assignedTo?.name}
                className={`${avatarColor} rounded-full p-1 text-xs w-full h-full flex items-center justify-center`}
              >
                {avatarFallbakText}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="size-6">
              <AvatarFallback
                title="Unassinged"
                className={`rounded-full p-1  bg-muted w-full h-full flex items-center justify-center`}
              >
                <User />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      <TaskDetailsDilalog
        open={openTaskDetailsDialod}
        setOpen={setOpenTaskDetailsDailog}
        taskId={task._id}
      />
    </>
  );
};
export default KanbanCard;
