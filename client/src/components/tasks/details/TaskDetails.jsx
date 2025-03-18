import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useParams } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { getAvatarFallbackText } from "@/components/avatar/getAvatarFallback";
import { getAvatarColor } from "@/components/avatar/getAvatarColor";
import { Loader, Pencil, PencilIcon, TrashIcon } from "lucide-react";
import DottedSeperator from "@/components/common/DottedSeperator";
import DetailProperty from "./DetailProperty";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskStatusEnum } from "@/components/enums/TaskEnums";
import { Badge } from "@/components/ui/badge";
import { statuses } from "../table/data";
import EditTaskCard from "../forms/EditTaskCard";

const TaskDetails = ({ task, setIsEditing }) => {
  const avatarFallbakText = getAvatarFallbackText(task?.assignedTo?.name);
  const avatarColor = getAvatarColor(task?.assignedTo?.name || "");
  const status = statuses.find((status) => status.value === task?.status);
  const formatDate = (date) => {
    if (!date) return;
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const capitalizeString = (string) => {
    if (!string) return;
    return string
      .toLowerCase()
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <div className="bg-muted p-4 rounded-lg h-max">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Task Overview</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsEditing((prev) => !prev);
          }}
        >
          <PencilIcon className="size-4 mr-2" />
          Edit
        </Button>
      </div>
      <DottedSeperator className="my-4" />
      <div className="flex flex-col gap-y-4">
        <DetailProperty label="Assigned To">
          {task?.assignedTo ? (
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback className={`${avatarColor} text-xs`}>
                  {avatarFallbakText}
                </AvatarFallback>
              </Avatar>
              <span>{task.assignedTo?.name}</span>
            </div>
          ) : (
            <span>Not assigned</span>
          )}
        </DetailProperty>
        <DetailProperty label="Due Date">
          {task?.dueDate ? formatDate(task?.dueDate) : "Add  due date"}
        </DetailProperty>
        <DetailProperty label="Status">
          <Badge
            className={`flex items-center gap-1 w-auto p-1 px-2 font-medium uppercase border-0 rounded-lg !bg-transparent !shadow-none ${status?.variant}`}
          >
            {status?.icon && <status.icon className="h-4 w-4 rounded-full" />}
            <span>{status?.label}</span>
          </Badge>
        </DetailProperty>
        <DetailProperty label="Project">
          <span className="bg-white shadow-sm rounded-sm">
            {task?.project.emoji}
          </span>{" "}
          {capitalizeString(task?.project.name)}
        </DetailProperty>
        <DetailProperty label="Priority">
          {capitalizeString(task?.priority)}
        </DetailProperty>
        <DetailProperty title="Description"></DetailProperty>
      </div>
    </div>
  );
};
export default TaskDetails;
