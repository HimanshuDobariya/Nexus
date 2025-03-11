import { getColumns } from "./table/Columns";
import DataTable from "./table/DataTable";
import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useParams } from "react-router-dom";

const TaskTable = () => {
  const { tasks, getAllTasks } = useTaskStore();
  const { workspaceId, projectId } = useParams();
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
  useEffect(() => {
    setFilters(initialFilters);
  }, [projectId]);

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

  useEffect(() => {
    fetchAllTasks();
  }, [pageNumber, pageSize, filters]);

  return (
    <div className="w-full">
      <DataTable
        loading={loading}
        data={tasks}
        columns={columns}
        pagination={{
          pageNumber,
          pageSize,
          totalCount,
        }}
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
        filterData={{ filters, setFilters, initialFilters }}
      />
    </div>
  );
};

export default TaskTable;
