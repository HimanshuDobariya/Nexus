import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import DottedSeperator from "../common/DottedSeperator";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DataTable from "./table/DataTable";
import { useTaskStore } from "@/store/taskStore";
import KanabnBoard from "./kanban/KanabnBoard";
import CreateTaskDailog from "./forms/CreateTaskDialog";
import DataCalander from "./calendar/DataCalander";
import { debounce } from "lodash";
import axios from "axios";
import PermissionGuard from "../common/PermissionGuard";
import { Permissions } from "../enums/PermissionsEnum";
import getTaskTableColumns from "./table/Columns";

const TaskViewSwitcher = () => {
  const columns = getTaskTableColumns();

  const [openCreateTaskForm, setOpenCreateTaskForm] = useState(false);
  const { projectId, workspaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, getAllTasks, updateTask } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const initialFilters = {
    status: "",
    priority: "",
    assignedTo: "",
    keyword: "",
    dueDate: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [currentTab, setCurrentTab] = useState(
    searchParams.get("task-view") || "table"
  );

  useEffect(() => {
    setCurrentTab(searchParams.get("task-view") || "table");
  }, [searchParams]);

  const handleTabChange = (value) => {
    setCurrentTab(value);
    const newParams = new URLSearchParams(searchParams);
    value === "table"
      ? newParams.delete("task-view")
      : newParams.set("task-view", value);
    setSearchParams(newParams);
    setFilters(initialFilters);
    setPageNumber(1);
    setPageSize(10);
  };
  const fetchAllTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTasks(workspaceId, projectId, {
        pageNumber,
        pageSize,
        ...filters,
      });
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, projectId, filters, pageNumber, pageSize]);

  const debouncedFetchAllTasks = useMemo(
    () => debounce(fetchAllTasks, 1000),
    [fetchAllTasks]
  );

  useEffect(() => {
    if (filters.keyword) {
      debouncedFetchAllTasks();
    } else {
      fetchAllTasks();
    }

    return () => debouncedFetchAllTasks.cancel();
  }, [filters, fetchAllTasks]);

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
                List
              </TabsTrigger>
              <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                Kanban
              </TabsTrigger>
              <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
                Calendar
              </TabsTrigger>
            </TabsList>
            <PermissionGuard requiredPermission={[Permissions.CREATE_TASK]}>
              <Button
                size="sm"
                className="w-full lg:w-auto"
                onClick={() => setOpenCreateTaskForm(true)}
              >
                <PlusIcon className="size-4" />
                New
              </Button>
            </PermissionGuard>
          </div>
          <DottedSeperator className="my-4" />

          <>
            <TabsContent value="table" className="mt-0">
              <DataTable
                columns={columns}
                data={tasks}
                loading={loading}
                pagination={{ pageNumber, pageSize, totalCount }}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                filterData={{ filters, setFilters, initialFilters }}
              />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <KanabnBoard
                data={tasks}
                onChange={onKanbanChange}
                filterData={{ filters, setFilters, initialFilters }}
                loading={loading}
              />
            </TabsContent>
            <TabsContent
              value="calendar"
              className="mt-0 h-full overflow-x-auto"
            >
              <DataCalander
                data={tasks}
                filterData={{ filters, setFilters, initialFilters }}
                loading={loading}
              />
            </TabsContent>
          </>
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
