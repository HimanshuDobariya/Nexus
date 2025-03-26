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
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/TaskEnums";

const formatLabel = (status) => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const statuses = [
  {
    value: TaskStatusEnum.BACKLOG,
    label: formatLabel(TaskStatusEnum.BACKLOG),
    icon: HelpCircle,
    variant: "!bg-gray-200 text-gray-600",
  },
  {
    value: TaskStatusEnum.TODO,
    label: formatLabel(TaskStatusEnum.TODO),
    icon: Circle,
    variant: "!bg-blue-100 text-blue-600",
  },
  {
    value: TaskStatusEnum.IN_PROGRESS,
    label: formatLabel(TaskStatusEnum.IN_PROGRESS),
    icon: Timer,
    variant: "!bg-yellow-200 text-yellow-700",
  },
  {
    value: TaskStatusEnum.IN_REVIEW,
    label: formatLabel(TaskStatusEnum.IN_REVIEW),
    icon: View,
    variant: "!bg-purple-200 text-purple-700",
  },
  {
    value: TaskStatusEnum.DONE,
    label: formatLabel(TaskStatusEnum.DONE),
    icon: CheckCircle,
    variant: "!bg-green-200 text-green-700",
  },
];

export const priorities = [
  {
    value: TaskPriorityEnum.LOW,
    label: formatLabel(TaskPriorityEnum.LOW),
    icon: ArrowDown,
    variant: "text-gray-600",
  },
  {
    value: TaskPriorityEnum.MEDIUM,
    label: formatLabel(TaskPriorityEnum.MEDIUM),
    icon: ArrowRight,
    variant: "text-yellow-700",
  },
  {
    value: TaskPriorityEnum.HIGH,
    label: formatLabel(TaskPriorityEnum.HIGH),
    icon: ArrowUp,
    variant: "text-orange-700",
  },
];
