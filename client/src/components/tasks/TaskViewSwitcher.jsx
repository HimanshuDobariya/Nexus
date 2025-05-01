import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import DottedSeperator from "../common/DottedSeperator";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DataTable from "./table/DataTable";
import { useTaskStore } from "@/store/taskStore";
import KanbanBoard from "./kanban/KanbanBoard";
import CreateTaskDialog from "./forms/CreateTaskDialog";
import DataCalendar from "./calendar/DataCalendar";
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
  const {
    tasks,
    currentTab,
    filters,
    pageNumber,
    pageSize,
    getAllTasks,
    setCurrentTab,
    setFilters,
    setPagination,
  } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const initialFilters = {
    status: "",
    priority: "",
    assignedTo: "",
    keyword: "",
    dueDate: "",
  };

  useEffect(() => {
    setCurrentTab(searchParams.get("task-view") || "table");
  }, [searchParams, setCurrentTab]);

  const handleTabChange = (value) => {
    setCurrentTab(value); // Update currentTab in Zustand store
    const newParams = new URLSearchParams(searchParams);
    value === "table"
      ? newParams.delete("task-view")
      : newParams.set("task-view", value);
    setSearchParams(newParams);
    setFilters(initialFilters); // Reset filters on tab change
    setPagination(1, 10); // Reset pagination on tab change
  };

  const fetchAllTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTasks(workspaceId, projectId);
      setTotalCount(data.totalCount); // Set the total count based on the fetched data
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, projectId, getAllTasks, pageNumber, pageSize]);

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
  }, [filters, fetchAllTasks, debouncedFetchAllTasks]);

  const onKanbanChange = useCallback(
    async (updatesPayload) => {
      if (Array.isArray(updatesPayload) && updatesPayload.length > 0) {
        try {
          await axios.patch(
            `${
              import.meta.env.VITE_SERVER_URL
            }/api/tasks/workspace/${workspaceId}/bulk-update`,
            { tasks: updatesPayload },
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.error("Error updating tasks:", error);
        }
      }
    },
    [workspaceId]
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case "table":
        return (
          <DataTable
            columns={columns}
            data={tasks}
            loading={loading}
            pagination={{ pageNumber, pageSize, totalCount }}
            setPagination={(pageNumber, pageSize) =>
              setPagination(pageNumber, pageSize)
            }
            setPageSize={(size) => setPagination(pageNumber, size)}
            filterData={{ filters, setFilters }}
          />
        );
      case "kanban":
        return (
          <KanbanBoard
            data={tasks}
            onChange={onKanbanChange}
            filterData={{ filters, setFilters }}
            loading={loading}
          />
        );
      case "calendar":
        return (
          <DataCalendar
            data={tasks}
            filterData={{ filters, setFilters, initialFilters }}
            loading={loading}
          />
        );
      default:
        return null;
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
          <TabsContent value={currentTab} className="mt-0">
            {renderTabContent()}
          </TabsContent>
        </div>
      </Tabs>
      <CreateTaskDialog
        open={openCreateTaskForm}
        setOpen={setOpenCreateTaskForm}
      />
    </>
  );
};

export default TaskViewSwitcher;
