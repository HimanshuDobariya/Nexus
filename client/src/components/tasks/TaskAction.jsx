import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PenLine,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import { useState } from "react";
import TaskForm from "./TaskForm";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import ConfirmationDilog from "@/components/common/ConfirmationDilog";
import { toast } from "@/hooks/use-toast";

const TaskAction = ({ id, projectId, children }) => {
  const { projectId: paramsProjectId, workspaceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const { deleteTask, getAllTasks, getTaskById } = useTaskStore();
  const navigate = useNavigate();

  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      await deleteTask(workspaceId, id);
      toast({
        description: "Task Deleted successfully.",
      });
      setOpenDeleteTaskDialog(false);
      setLoading(false);

      if (projectId) {
        await getAllTasks(workspaceId, { projectId });
      } else {
        await getAllTasks(workspaceId);
      }
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

  const handleEditTask = async () => {
    try {
      const task = await getTaskById(workspaceId, projectId, id);
      setTaskData({
        ...task,
        dueDate: new Date(task.dueDate),
        projectId: task.project,
      });
    } catch (error) {
      console.log(error);
    }
    setIsEditTask(true);
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
                navigate(`/workspaces/${workspaceId}/tasks/${id}`);
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
                  navigate(`/workspaces/${workspaceId}/project/${projectId}`);
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
      </div>
      <TaskForm
        open={isEditTask}
        setOpen={setIsEditTask}
        initialData={taskData}
        projectId={paramsProjectId}
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
export default TaskAction;
