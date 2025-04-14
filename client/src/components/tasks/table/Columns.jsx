// getTaskTableColumns.ts
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
import { Permissions } from "@/components/enums/PermissionsEnum";
import useHasPermission from "@/hooks/useHasPermission";

const columnHelper = createColumnHelper();

const getTaskTableColumns = () => {
  const hasActionPermission = useHasPermission([
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,
  ]);

  const columns = [
    columnHelper.accessor("taskCode", {
      id: "taskCode",
      header: ({ column }) => <ColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="capitalize border-neutral-300 shrink-0 h-[25px]"
        >
          {row.original.taskCode}
        </Badge>
      ),
      meta: { label: "Code" },
    }),

    columnHelper.accessor("title", {
      id: "title",
      header: ({ column }) => <ColumnHeader column={column} title="Title" />,
      cell: ({ row }) => <div>{row.original.title}</div>,
      meta: { label: "Title" },
    }),

    columnHelper.accessor((row) => row.assignedTo?.name || "", {
      id: "assignedTo",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Assigned To" />
      ),
      cell: ({ row }) => {
        const assignee = row.original.assignedTo;
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
                {name}
              </span>
            </div>
          )
        );
      },
      meta: { label: "Assigned To" },
    }),

    columnHelper.accessor("dueDate", {
      id: "dueDate",
      header: ({ column }) => <ColumnHeader column={column} title="Due Date" />,
      cell: ({ row }) => (
        <span className="lg:max-w-[100px] text-sm">
          {row.original.dueDate ? format(row.original.dueDate, "PPP") : null}
        </span>
      ),
      meta: { label: "Due Date" },
    }),

    columnHelper.accessor("status", {
      id: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = statuses.find((s) => s.value === row.getValue("status"));
        if (!status) return null;

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

    columnHelper.accessor("priority", {
      id: "priority",
      header: ({ column }) => <ColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => {
        const priority = priorities.find(
          (p) => p.value === row.getValue("priority")
        );
        if (!priority) return null;

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
  ];

  if (hasActionPermission) {
    columns.push({
      id: "action",
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <TaskAction data={data}>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted no-row-click"
            >
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </TaskAction>
        );
      },
      meta: { label: "Action" },
      enableSorting: false,
      enableColumnFilter: false,
    });
  }

  return columns;
};

export default getTaskTableColumns;
