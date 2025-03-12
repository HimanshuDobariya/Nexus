import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import ColumnHeader from "./ColumnHeader";
import { Badge } from "@/components/ui/badge";
import { getAvatarFallbackText } from "@/components/avatar/getAvatarFallback";
import { getAvatarColor } from "@/components/avatar/GetAvatarColor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { priorities, statuses } from "./data";
import TaskAction from "../TaskAction";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const columnHelper = createColumnHelper();

export const getColumns = (projectId) => {
  const columns = [
    // Task Title
    columnHelper.accessor("title", {
      header: ({ column }) => <ColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        return (
          <div className="flex flex-nowrap items-center space-x-2">
            <Badge
              variant="outline"
              className="capitalize border-neutral-300 shrink-0 h-[25px]"
            >
              {row.original.taskCode}
            </Badge>
            <span className="block lg:max-w-[220px] max-w-[200px] font-medium">
              {row.original.title}
            </span>
          </div>
        );
      },
    }),

    // Projet
    ...(projectId
      ? []
      : [
          columnHelper.accessor((row) => row.project?.name || "", {
            id: "project",
            header: ({ column }) => (
              <ColumnHeader column={column} title="Project" />
            ),
            cell: ({ row }) => {
              const project = row.original.project;
              if (!project) {
                return null;
              }
              return (
                <div className="flex items-center gap-1">
                  <span className="rounded-sm bg-white border text-lg flex items-center justify-center">
                    {project.emoji}
                  </span>
                  <span className="block capitalize truncate w-[100px] text-[15px]">
                    {project.name}
                  </span>
                </div>
              );
            },
          }),
        ]),

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
    }),

    // Action
    columnHelper.accessor("action", {
      header: "Action",
      cell: ({ row }) => {
        const id = row.original._id;
        const projectId = row.original.project._id;
        return (
          <>
            <TaskAction id={id} projectId={projectId}>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
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

  return columns;
};
