import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Loader, PlusIcon } from "lucide-react";
import DottedSeperator from "../common/DottedSeperator";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import { useParams, useSearchParams } from "react-router-dom";
import { getColumns } from "./table/Columns";
import DataTable from "./table/DataTable";
import { useTaskStore } from "@/store/taskStore";
import DataFilters from "./DataFilters";

const TaskViewSwitcher = () => {
  const [openCreateTaskForm, setOpenCreateTaskForm] = useState(false);
  const { projectId, workspaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, getAllTasks } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const initialFilters = {
    projectId: projectId || "",
    status: "",
    priority: "",
    assignedTo: "",
    dueDate: "",
  };
  const [filters, setFilters] = useState({});
  const columns = getColumns(projectId);

  const currentTab = searchParams.get("task-view") || "table";

  useEffect(() => {
    setFilters(initialFilters);
  }, [projectId]);

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

  const handleTabChange = (value) => {
    if (value === "table") {
      searchParams.delete("task-view");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ "task-view": value });
    }
  };

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
              <Loader className="!size-6 animate-spin" />
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
                Kanban Board
              </TabsContent>
              <TabsContent value="calendar" className="mt-0">
                Calendar View
              </TabsContent>
            </>
          )}
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
