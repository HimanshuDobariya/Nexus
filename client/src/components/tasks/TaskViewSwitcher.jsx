import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Loader, PlusIcon } from "lucide-react";
import DottedSeperator from "../common/DottedSeperator";
import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getColumns } from "./table/Columns";
import DataTable from "./table/DataTable";
import { useTaskStore } from "@/store/taskStore";
import DataFilters from "./DataFilters";
import KanabnBoard from "./kanban/KanabnBoard";
import CreateTaskDailog from "./forms/CreateTaskDialog";
import axios from "axios";
import DataCalander from "./calendar/DataCalander";
import { useProjectStore } from "@/store/projectStore";

const TaskViewSwitcher = () => {
  const [openCreateTaskForm, setOpenCreateTaskForm] = useState(false);
  const { projectId, workspaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, getAllTasks, updateTask } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { projects } = useProjectStore();

  const initialFilters = {
    projectId: projectId || "",
    status: "",
    priority: "",
    assignedTo: "",
    keyword: "",
    dueDate: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const columns = getColumns(projectId);

  const [currentTab, setCurrentTab] = useState(
    searchParams.get("task-view") || "table"
  );
  const handleTabChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "table") {
      newParams.delete("task-view");
    } else {
      newParams.set("task-view", value);
    }
    setCurrentTab(value);
    setSearchParams(newParams);
    setFilters(initialFilters);
  };

  const onKanbanChange = useCallback(
    async (updatesPayload) => {
      if (!Array.isArray(updatesPayload) || updatesPayload.length === 0) return;

      try {
        await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/tasks/workspace/${workspaceId}/bulk-update`,
          { tasks: updatesPayload },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error updating tasks:", error);
      }
    },
    [updateTask]
  );

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setLoading(true);
        const data = await getAllTasks(workspaceId, {
          pageNumber,
          pageSize,
          ...filters,
        });
        setTotalCount(data.totalCount);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchAllTasks();
  }, [pageNumber, pageSize, filters]);

  useEffect(() => {
    setFilters(initialFilters);
    setPageNumber(1);
    setPageSize(10);
  }, [projectId]);

  return (
    <>
      <Tabs
        className="w-full rounded-lg border flex-1"
        value={currentTab}
        onValueChange={handleTabChange}
      >
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
                if (!projects.length) {
                  alert("You have to first create project.");
                  return;
                }
                setOpenCreateTaskForm(true);
              }}
            >
              <PlusIcon className="size-4 mr-2" />
              New
            </Button>
          </div>
          <DottedSeperator className="my-4" />

          <div className="w-full">
            <DataFilters
              filterData={{ filters, setFilters, initialFilters }}
              setPageNumber={setPageNumber}
              setPageSize={setPageSize}
            />
          </div>
          <DottedSeperator className="my-4" />

          {loading ? (
            <div className="w-full rounded-lg border h-[200px] flex flex-col items-center justify-center">
              <Loader className="!size-8 animate-spin" />
            </div>
          ) : (
            <>
              <TabsContent value="table" className="mt-0">
                <DataTable
                  columns={columns}
                  data={tasks}
                  pagination={{
                    pageNumber,
                    pageSize,
                    totalCount,
                  }}
                  setPageNumber={setPageNumber}
                  setPageSize={setPageSize}
                />
              </TabsContent>
              <TabsContent value="kanban" className="mt-0">
                <KanabnBoard data={tasks} onChange={onKanbanChange} />
              </TabsContent>
              <TabsContent
                value="calendar"
                className="mt-0 h-full overflow-x-auto"
              >
                <DataCalander data={tasks} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
      <CreateTaskDailog
        open={openCreateTaskForm}
        setOpen={setOpenCreateTaskForm}
      />
    </>
  );
};
export default TaskViewSwitcher;
