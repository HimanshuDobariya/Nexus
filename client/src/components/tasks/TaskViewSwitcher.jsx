import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import DottedSeperator from "../common/DottedSeperator";
import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { useParams } from "react-router-dom";
import TaskTable from "./TaskTable";
import { useTaskStore } from "@/store/taskStore";

const TaskViewSwitcher = () => {
  const [openCreateTaskForm, setOpenCreateTaskForm] = useState(false);
  const { projectId, workspaceId } = useParams();
  const [loading, setLoading] = useState(false);
  const { getAllTasks, tasks } = useTaskStore();

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      if (projectId) {
        await getAllTasks(workspaceId, { projectId });
        setLoading(false);
      } else {
        await getAllTasks(workspaceId);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, [projectId]);

  console.log(tasks);

  return (
    <>
      <Tabs className="w-full rounded-lg border flex-1" defaultValue="table">
        <div className="h-full flex flex-col overflow-auto p-4">
          <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                Table
              </TabsTrigger>
              <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                Kanban
              </TabsTrigger>
              <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
                Calendar
              </TabsTrigger>
            </TabsList>
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={() => {
                setOpenCreateTaskForm(true);
              }}
            >
              <PlusIcon className="size-4 mr-2" />
              New
            </Button>
          </div>
          <div className="my-4">
            <DottedSeperator />
          </div>
          Filters
          <div className="my-4">
            <DottedSeperator />
          </div>
          <>
            <TabsContent value="table" className="mt-0">
              <TaskTable />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              Kanban Board
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              Calendar View
            </TabsContent>
          </>
        </div>
      </Tabs>

      <TaskForm
        open={openCreateTaskForm}
        setOpen={setOpenCreateTaskForm}
        projectId={projectId}
      />
    </>
  );
};
export default TaskViewSwitcher;
