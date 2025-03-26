import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PenLine, SquareArrowOutUpRight, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import ConfirmationDilog from "@/components/common/ConfirmationDilog";
import { toast } from "@/hooks/use-toast";
import EditTaskDialog from "./forms/EditTaskDialog";

const TaskAction = ({ children, data }) => {
  const { projectId, workspaceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState(false);
  const { deleteTask } = useTaskStore();
  const navigate = useNavigate();

  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      await deleteTask(workspaceId, projectId, data._id);
      toast({
        variant: "success",
        description: "Task Deleted successfully.",
      });
      setOpenDeleteTaskDialog(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setOpenDeleteTaskDialog(false);
      setLoading(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Failed to delete task.",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <div className="no-row-click">
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/workspaces/${workspaceId}/projects/${projectId}/tasks/${data._id}`
              );
            }}
            disabled={false}
          >
            <SquareArrowOutUpRight className="size-4 mr-2" />
            Task Details
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenEditTaskDialog(true);
            }}
          >
            <PenLine className="size-4 mr-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className={`!text-destructive cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              setOpenDeleteTaskDialog(true);
            }}
          >
            <Trash />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDilog
        title={`Delete ${data.taskCode} ?`}
        description="You're about to permanently delete this issue, its comments and attachments, and all of its data"
        confirmText="Delete"
        open={openDeleteTaskDialog}
        onOpenChange={setOpenDeleteTaskDialog}
        handleConfirm={handleDeleteTask}
        handleCancel={() => {
          setOpenDeleteTaskDialog(false);
        }}
        loading={loading}
      />

      <EditTaskDialog
        open={openEditTaskDialog}
        setOpen={setOpenEditTaskDialog}
        initialData={data}
      />
    </>
  );
};
export default TaskAction;
