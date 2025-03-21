import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnalyticsCard from "../common/AnalyticsCard";
import TaskStatusChart from "./charts/TaskStatusChart";
import useWorkspaceAnalytics from "@/hooks/useWorkspaceAnalytics";
import { Loader } from "lucide-react";
import TaskMembersChart from "./charts/TaskMembersChart";
import TasksDurationMulipleLineChart from "./charts/TasksDurationMulipleLineChart";
import ProjectTasksChart from "./charts/ProjectTasksChart";

const WorkspaceAnalytics = () => {
  const { workspaceId } = useParams();
  const { getWorkspaceAnalytics, analytics, isLoading } =
    useWorkspaceAnalytics(workspaceId);

  useEffect(() => {
    getWorkspaceAnalytics();
  }, [workspaceId]);

  return (
    <div>
      {/* <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
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
      </div> */}

      <div className=" grid grid-cols-2 gap-4">
        <TaskStatusChart
          data={analytics?.taskStatusArray}
          isLoading={isLoading}
        />
        <TaskMembersChart
          data={analytics?.taskMemberArray}
          isLoading={isLoading}
        />

        <TasksDurationMulipleLineChart
          data={analytics?.taskMonthArray}
          isLoading={isLoading}
        />

        <ProjectTasksChart
          data={analytics?.projectTaskArray}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
export default WorkspaceAnalytics;
