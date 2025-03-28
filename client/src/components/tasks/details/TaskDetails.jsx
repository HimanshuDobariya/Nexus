import { Button } from "@/components/ui/button";
import { Link, Pencil, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { statuses } from "../data";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import EditTaskCard from "../forms/EditTaskCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TaskDetails = ({ task }) => {
  const formatDate = (date) => {
    if (!date) return;
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [tooltipText, setTooltipText] = useState("Copy");
  const [isOpen, setIsOpen] = useState(false);

  const currentTaskStatus = statuses.filter(
    (status) => status.value === task?.status
  )[0];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_CLIENT_URL}/workspaces/${
        task.workspace
      }/projects/${task.project._id}/tasks/${task._id}`
    );
    setTooltipText("Copied");
    setIsOpen(true);

    setTimeout(() => {
      setTooltipText("Copy");
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-semibold">{task?.title}</h1>

          <TooltipProvider>
            <Tooltip open={isOpen} onOpenChange={setIsOpen}>
              <TooltipTrigger asChild>
                <Link
                  onClick={copyToClipboard}
                  onMouseEnter={() => setIsOpen(true)}
                  className="size-4 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {!isEditMode && (
          <Button size="sm" onClick={() => setIsEditMode(true)}>
            <Pencil className="size-4 mr-2" /> Edit
          </Button>
        )}
      </div>

      <div
        className={`relative
          grid gap-6 py-4 grid-rows-[repeat(auto-fill,_minmax(100px,_auto))] 
          ${
            isEditMode
              ? "grid-cols-[4fr_3fr] grid-rows-2"
              : "grid-cols-[4fr_3fr] grid-rows-1"
          }
        `}
      >
        <div
          className={`
            ${
              isEditMode
                ? "col-start-1 col-span-1 row-start-1 row-span-1"
                : "col-start-1 col-span-1 row-start-1 row-span-1"
            }
          `}
        >
          <div>
            <Label>Description</Label>
            <Card className="shadow-none mt-2 min-h-[150px]">
              <CardContent className="p-4">
                <p className="text-sm">
                  {task?.description || "No description specified..."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div
          className={`
            ${
              isEditMode
                ? "col-start-1 col-span-1 row-start-2 row-span-1"
                : "col-start-2 col-span-1 row-start-1 row-span-1"
            }
          `}
        >
          <Card className="shadow-none">
            <CardHeader className="p-4 pb-2 text-sm font-medium">
              Details
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 items-center gap-2">
                <Label>Status</Label>
                <Badge
                  className={`${currentTaskStatus?.variant} h-8 max-w-max shadow-none`}
                >
                  {currentTaskStatus?.icon && (
                    <currentTaskStatus.icon className="size-4 mr-2" />
                  )}{" "}
                  {currentTaskStatus?.label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label>Assigned To</Label>
                <div className="flex items-center gap-2">
                  <Avatar className="!size-8">
                    <AvatarFallback
                      className={`${
                        task?.assignedTo?.name &&
                        getAvatarColor(task?.assignedTo?.name || "")
                      } w-full h-full inline-flex items-center justify-center rounded-full`}
                    >
                      {task?.assignedTo?.name ? (
                        getAvatarFallbackText(task?.assignedTo?.name)
                      ) : (
                        <User className="size-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {task?.assignedTo?.name || "Unassigned"}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label>Priority</Label>
                <span className="capitalize">
                  {task?.priority.toLowerCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label>Due Date</Label>
                <div className="flex max-w-max items-center h-8 px-3 border rounded-md text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  {task?.dueDate ? (
                    <span>{formatDate(task?.dueDate)}</span>
                  ) : (
                    "Not specified"
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isEditMode && (
          <div
            className="
               border rounded-xl
              col-start-2 col-span-1 h-max row-span-2  w-full absolute top-4  
            "
          >
            <EditTaskCard task={task} setIsEditMode={setIsEditMode} />
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskDetails;
