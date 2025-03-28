import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnalyticsCard from "../common/AnalyticsCard";
import TaskStatusChart from "./charts/TaskStatusChart";
import useWorkspaceAnalytics from "@/hooks/useWorkspaceAnalytics";
import { List, Loader } from "lucide-react";
import TaskMembersChart from "./charts/TaskMembersChart";
import TasksDurationMulipleLineChart from "./charts/TasksDurationMulipleLineChart";
import ProjectTasksChart from "./charts/ProjectTasksChart";
import { useProjectStore } from "@/store/projectStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WorkspaceAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { workspaceId } = useParams();
  const [selectProject, setSelectProject] = useState(null);
  const { analytics, isLoading } = useWorkspaceAnalytics(
    workspaceId,
    selectProject,
    selectedYear
  );
  const { projects } = useProjectStore();
  return (
    <div>
      {projects.length > 0 && (
        <Select
          value={selectProject === null ? "all" : selectProject}
          onValueChange={(value) => {
            setSelectProject(value === "all" ? null : value);
          }}
        >
          <SelectTrigger className="mb-4 w-[200px]">
            <SelectValue
              placeholder={
                <span className="flex items-center gap-2">All Projects</span>
              }
            />
          </SelectTrigger>
          <SelectContent className="w-auto">
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <List className="size-4" />
                <span>All Projects</span>
              </div>
            </SelectItem>
            <SelectSeparator />
            {projects.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                <span className="text-[16px] mr-1"> {project.emoji}</span>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          isLoading={isLoading}
          title="Total Task"
          value={analytics?.totalTasks || 0}
        />
        <AnalyticsCard
          isLoading={isLoading}
          title="Overdue Task"
          value={analytics?.overdueTasks || 0}
        />
        <AnalyticsCard
          isLoading={isLoading}
          title="Completed Task"
          value={analytics?.completedTasks || 0}
        />
        <AnalyticsCard
          isLoading={isLoading}
          title="Unassigned Task"
          value={analytics?.unassignedTasks || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-6">
        <TaskStatusChart
          data={analytics?.taskStatusArray}
          isLoading={isLoading}
        />
        <TaskMembersChart
          data={analytics?.taskMemberArray}
          isLoading={isLoading}
        />
        <ProjectTasksChart
          data={analytics?.projectTaskArray}
          isLoading={isLoading}
        />

        <TasksDurationMulipleLineChart
          data={analytics?.taskMonthArray}
          isLoading={isLoading}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </div>
    </div>
  );
};
export default WorkspaceAnalytics;
