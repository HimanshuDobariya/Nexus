import { TaskPriorityEnum, TaskStatusEnum } from "../../enums/TaskEnums";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  HelpCircle,
  Timer,
  View,
} from "lucide-react";

const formatStatusLabel = (status) => {
  return status.replace(/_/g, " ");
};

export const statuses = [
  {
    value: TaskStatusEnum.BACKLOG,
    label: formatStatusLabel(TaskStatusEnum.BACKLOG),
    icon: HelpCircle,
    variant: "!bg-gray-200 text-gray-600",
  },
  {
    value: TaskStatusEnum.TODO,
    label: formatStatusLabel(TaskStatusEnum.TODO),
    icon: Circle,
    variant: "!bg-blue-100 text-blue-600",
  },
  {
    value: TaskStatusEnum.IN_PROGRESS,
    label: formatStatusLabel(TaskStatusEnum.IN_PROGRESS),
    icon: Timer,
    variant: "!bg-yellow-200 text-yellow-700",
  },
  {
    value: TaskStatusEnum.IN_REVIEW,
    label: formatStatusLabel(TaskStatusEnum.IN_REVIEW),
    icon: View,
    variant: "!bg-purple-200 text-purple-700",
  },
  {
    value: TaskStatusEnum.DONE,
    label: formatStatusLabel(TaskStatusEnum.DONE),
    icon: CheckCircle,
    variant: "!bg-green-200 text-green-700",
  },
];

export const priorities = [
  {
    value: TaskPriorityEnum.LOW,
    label: "LOW",
    icon: ArrowDown,
    variant: "text-gray-600",
  },
  {
    value: TaskPriorityEnum.MEDIUM,
    label: "MEDIUM",
    icon: ArrowRight,
    variant: "text-yellow-700",
  },
  {
    value: TaskPriorityEnum.HIGH,
    label: "HIGH",
    icon: ArrowUp,
    variant: "text-orange-700",
  },
];
