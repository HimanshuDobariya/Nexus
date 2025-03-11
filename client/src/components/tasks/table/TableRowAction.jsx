import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  PenLine,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TaskForm from "../TaskForm";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import ConfirmationDilog from "@/components/common/ConfirmationDilog";
import { toast } from "@/hooks/use-toast";

const TableRowAction = ({ row }) => {
  const [isEditTask, setIsEditTask] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const { projectId, workspaceId } = useParams();
  const { deleteTask, getAllTasks } = useTaskStore();
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEditTask = () => {
    setTaskData({
      id: row.original?._id,
      title: row.original?.title,
      description: row.original?.description,
      status: row.original?.status,
      priority: row.original?.priority,
      assignedTo: row.original?.assignedTo?._id,
      projectId: row.original?.project?._id,
      dueDate: row.original?.dueDate ? new Date(row.original.dueDate) : null,
    });
    setIsEditTask(true);
  };

  const handleDeleteTask = async () => {
    const taskId = row.original._id;
    try {
      setLoading(true);
      await deleteTask(workspaceId, taskId);
      toast({
        description: "Task Deleted successfully.",
      });
      if (projectId) {
        await getAllTasks(workspaceId, { projectId });
      } else {
        await getAllTasks(workspaceId);
      }
      setOpenDeleteTaskDialog(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setOpenDeleteTaskDialog(false);
      setLoading(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Unable to delete task.",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigate(
                `/workspaces/${row.original?.workspace}/tasks/${row.original?._id}`
              );
            }}
            disabled={false}
          >
            <SquareArrowOutUpRight className="size-4 mr-2" />
            Task Details
          </DropdownMenuItem>

          {!projectId && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigate(
                  `/workspaces/${row.original?.workspace}/project/${row.original?.project?._id}`
                );
              }}
              disabled={false}
            >
              <SquareArrowOutUpRight className="size-4 mr-2" />
              Open Project
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleEditTask}
            disabled={isEditTask}
          >
            <PenLine className="size-4 mr-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`!text-destructive cursor-pointer`}
            onClick={() => {
              setOpenDeleteTaskDialog(true);
            }}
          >
            <Trash />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskForm
        open={isEditTask}
        setOpen={setIsEditTask}
        initialData={taskData}
        projectId={projectId}
      />

      <ConfirmationDilog
        title="Are you sure to delete task?"
        description="This action cannot be undone."
        confirmText="Delete"
        open={openDeleteTaskDialog}
        onOpenChange={setOpenDeleteTaskDialog}
        handleConfirm={handleDeleteTask}
        handleCancel={() => {
          setOpenDeleteTaskDialog(false);
        }}
        loading={loading}
      />
    </>
  );
};
export default TableRowAction;
