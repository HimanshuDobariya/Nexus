import { TaskStatusEnum } from "@/components/enums/TaskEnums";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useState } from "react";
import TaskDetailsDilalog from "../details/TaskDetailsDilalog";

const statusColorMap = {
  [TaskStatusEnum.BACKLOG]: "border-l-pink-400",
  [TaskStatusEnum.TODO]: "border-l-red-400",
  [TaskStatusEnum.IN_PROGRESS]: "border-l-yellow-400",
  [TaskStatusEnum.IN_REVIEW]: "border-l-blue-400",
  [TaskStatusEnum.DONE]: "border-l-emerald-400",
};

const EventCard = ({ id, title, taskCode, assignedTo, status }) => {
  const avatarFallbackText = getAvatarFallbackText(assignedTo);
  const avatarColor = getAvatarColor(assignedTo || "");
  const [openTaskDetailsDialog, setOpenTaskDetailsDialog] = useState(false);
  return (
    <>
      <div className="px-2">
        <div
          className={cn(
            "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition shadow-sm",
            statusColorMap[status] || "border-l-gray-400"
          )}
          onClick={() => {
            setOpenTaskDetailsDialog(true)
          }}
        >
          <div className="flex items-center gap-2 justify-between">
            <h3
              className="text-[10px] font-medium hover:underline transition"
              title={title}
            >
              {title.length > 20 ? title.substring(0, 17) + "..." : title}
            </h3>
          </div>

          <div className="flex gap-3 justify-between">
            <Badge
              variant="secondary"
              className="text-[8px] py-0 px-2 whitespace-nowrap"
            >
              {taskCode}
            </Badge>
            {assignedTo ? (
              <Avatar className="size-4">
                <AvatarFallback
                  title={assignedTo}
                  className={`${avatarColor}  rounded-full p-1 text-[8px] w-full h-full flex items-center justify-center`}
                >
                  {avatarFallbackText}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="size-4">
                <AvatarFallback
                  title="Unassinged"
                  className={`rounded-full p-0.5 bg-muted w-full h-full flex items-center justify-center`}
                >
                  <User />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>

      <TaskDetailsDilalog
        open={openTaskDetailsDialog}
        setOpen={setOpenTaskDetailsDialog}
        taskId={id}
      />
    </>
  );
};
export default EventCard;
