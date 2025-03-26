import { TaskStatusEnum } from "@/components/enums/TaskEnums";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import { cn } from "@/lib/utils";
import { Goal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EventCard = ({ id, title, taskCode, assignedTo, priority, status }) => {
  const avatarFallbackText = getAvatarFallbackText(assignedTo);
  const avatarColor = getAvatarColor(assignedTo || "");
  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams();
  const statusColorMap = {
    [TaskStatusEnum.BACKLOG]: "border-l-pink-400",
    [TaskStatusEnum.TODO]: "border-l-red-400",
    [TaskStatusEnum.IN_PROGRESS]: "border-l-yellow-400",
    [TaskStatusEnum.IN_REVIEW]: "border-l-blue-400",
    [TaskStatusEnum.DONE]: "border-l-emerald-400",
  };

  return (
    <div className="px-2">
      <div
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition shadow-sm",
          statusColorMap[status] || "border-l-gray-400"
        )}
        onClick={() => {
          navigate(
            `/workspaces/${workspaceId}/projects/${projectId}/tasks/${id}`
          );
        }}
      >
        <div className="flex items-center justify-between">
          <p className="font-medium truncate max-w-[70%]">{title}</p>
          <Badge
            variant="secondary"
            className="text-[10px] py-0 px-1 whitespace-nowrap"
          >
            {taskCode}
          </Badge>
        </div>

        <div className="flex items-center justify-between space-x-1">
          <div className="flex items-center font-medium">
            <Goal className="size-3 mr-1 text-neutral-500" />
            <span className="text-neutral-500">{priority}</span>
          </div>
          {assignedTo && (
            <Avatar className="size-6">
              <AvatarFallback className={`${avatarColor} text-xs`}>
                {avatarFallbackText}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
};
export default EventCard;
