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
  const { projectId: paramsProjectId, workspaceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState(false);
  const { deleteTask } = useTaskStore();
  const navigate = useNavigate();

  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      await deleteTask(workspaceId, data._id);
      toast({
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
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigate(`/workspaces/${workspaceId}/tasks/${data._id}`);
              }}
              disabled={false}
            >
              <SquareArrowOutUpRight className="size-4 mr-2" />
              Task Details
            </DropdownMenuItem>

            {!paramsProjectId && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  navigate(
                    `/workspaces/${workspaceId}/project/${data.project._id}`
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
              onClick={() => {
                setOpenEditTaskDialog(true);
              }}
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
      </div>

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

      <EditTaskDialog
        open={openEditTaskDialog}
        setOpen={setOpenEditTaskDialog}
        initialData={data}
      />
    </>
  );
};
export default TaskAction;
