import { createColumnHelper } from "@tanstack/react-table";
import ColumnHeader from "./ColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { priorities, statuses } from "../data";
import TaskAction from "../TaskAction";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";

const columnHelper = createColumnHelper();

const columns = [
  // Key
  columnHelper.accessor("taskCode", {
    header: ({ column }) => <ColumnHeader column={column} title="Code" />,
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className="capitalize border-neutral-300 shrink-0 h-[25px]"
        >
          {row.original.taskCode}
        </Badge>
      );
    },
    meta: { label: "Code" },
  }),

  // Task Title
  columnHelper.accessor("title", {
    header: ({ column }) => <ColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return <div>{row.original.title}</div>;
    },
    meta: { label: "Title" },
  }),

  // Assigned memebr
  columnHelper.accessor((row) => row.assignedTo?.name || "", {
    id: "assignedTo",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Assigned To" />
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignedTo || null;
      const name = assignee?.name || "";

      const initials = getAvatarFallbackText(name);
      const avatarColor = getAvatarColor(name);

      return (
        name && (
          <div className="flex items-center gap-1">
            <Avatar className="h-8 w-8 flex items-center justify-center bg-red-200">
              <AvatarImage src={assignee?.profilePicture || ""} alt={name} />
              <AvatarFallback className={avatarColor}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="block text-ellipsis w-[100px] truncate">
              {assignee?.name}
            </span>
          </div>
        )
      );
    },
    meta: { label: "Assigned To" },
  }),

  // Due Date
  columnHelper.accessor("dueDate", {
    header: ({ column }) => <ColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => {
      return (
        <span className="lg:max-w-[100px] text-sm">
          {row.original.dueDate ? format(row.original.dueDate, "PPP") : null}
        </span>
      );
    },
    meta: { label: "Due Date" },
  }),

  // Status
  columnHelper.accessor("status", {
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      const Icon = status.icon;

      return (
        <div className="flex items-center">
          <Badge
            className={`flex items-center gap-1 w-auto p-1 px-2 font-medium uppercase border-0 rounded-lg !bg-transparent !shadow-none ${status.variant}`}
          >
            <Icon className="h-4 w-4 rounded-full" />
            <span>{status.label}</span>
          </Badge>
        </div>
      );
    },
    meta: { label: "Status" },
  }),

  // Priority
  columnHelper.accessor("priority", {
    header: ({ column }) => <ColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      );

      if (!priority) {
        return null;
      }

      const Icon = priority.icon;

      return (
        <div className="flex items-center">
          <Badge
            className={`flex items-center gap-1 w-auto p-1 px-2 font-medium uppercase border-0 rounded-lg !bg-transparent !shadow-none ${priority.variant}`}
          >
            <Icon className="h-4 w-4 rounded-full" />
            <span>{priority.label}</span>
          </Badge>
        </div>
      );
    },
    meta: { label: "Priority" },
  }),

  // Action
  columnHelper.accessor("action", {
    header: "Action",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <>
          <TaskAction data={data}>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted no-row-click"
            >
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </TaskAction>
        </>
      );
    },
  }),
];

export default columns;
