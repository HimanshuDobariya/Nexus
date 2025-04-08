import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AnalyticsCard from "../common/AnalyticsCard";
import TaskStatusChart from "./charts/TaskStatusChart";
import useWorkspaceAnalytics from "@/hooks/useWorkspaceAnalytics";
import { List } from "lucide-react";
import TaskMembersChart from "./charts/TaskMembersChart";
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
import TaskPriorityChart from "./charts/TaskPriorityChart";
import ChartDialog from "./charts/common/ChartDialog";
import ChartCard from "./charts/common/ChartCard";
import html2canvas from "html2canvas";
import IncompleteTasksByMemberChart from "./charts/IncompleteTasksByMemberChart";
import jsPDF from "jspdf";
import Papa from "papaparse";

const WorkspaceAnalytics = () => {
  const { workspaceId } = useParams();
  const [selectProject, setSelectProject] = useState(null);
  const { projects } = useProjectStore();
  const { analytics, loading, handleRefresh } = useWorkspaceAnalytics(
    workspaceId,
    selectProject
  );

  const [isExpand, setIsExpand] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const taskPriorityRef = useRef(null);
  const taskStatusRef = useRef(null);
  const taskMemberRef = useRef(null);
  const projectTasksRef = useRef(null);
  const incompleteTasksByMemberRef = useRef(null);

  const handleExportImage = useCallback(async (ref, title = "chart") => {
    if (!ref?.current) return;

    const canvas = await html2canvas(ref.current, {
      ignoreElements: (element) => element.classList?.contains("export-ignore"),
      useCORS: true,
    });

    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${title}.jpg`;
    link.click();
  }, []);

  const handleExportPDF = async (ref, title = "chart") => {
    if (!ref?.current) return;

    const canvas = await html2canvas(ref.current, {
      ignoreElements: (element) => element.classList?.contains("export-ignore"),
      useCORS: true,
      scale: 2, // Higher scale for better quality
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape", // or "portrait"
      unit: "px",
      format: [canvas.width, canvas.height], // match canvas size
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${title}.pdf`);
  };
  console.log(analytics);
  const capitalizeString = (string) => {
    if (!string) return;
    return string
      .toLowerCase()
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const flattenObject = (obj, result = {}) => {
    for (const key in obj) {
      const value = obj[key];

      if (Array.isArray(value)) {
        result[capitalizeString(key)] = capitalizeString(JSON.stringify(value));
      } else if (value !== null && typeof value === "object") {
        flattenObject(value, result); // Recursively flatten
      } else {
        const capitalizedValue =
          typeof value === "string" ? capitalizeString(value) : value;

        result[capitalizeString(key)] = capitalizedValue;
      }
    }
    return result;
  };

  const handleExportCSV = async (data, title = "chart") => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Invalid or empty data for CSV export.");
      return;
    }
    const flattenedData = data.map((item) => flattenObject(item));
    const csv = Papa.unparse(flattenedData, {
      quotes: true,
      skipEmptyLines: true,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.csv`;
    link.click();
  };

  return (
    <>
      <div className="space-y-5">
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
            isLoading={loading.totalTasks}
            title="Total Task"
            value={analytics?.totalTasks || 0}
          />
          <AnalyticsCard
            isLoading={loading.completedTasks}
            title="Completed Task"
            value={analytics?.completedTasks || 0}
          />
          <AnalyticsCard
            isLoading={loading.overdueTasks}
            title="Overdue Task"
            value={analytics?.overdueTasks || 0}
          />
          <AnalyticsCard
            isLoading={loading.unassignedTasks}
            title="Unassigned Task"
            value={analytics?.unassignedTasks || 0}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <ChartCard
            title="Tasks By Priority"
            onRefresh={() => {
              handleRefresh(["taskPriorityArray"]);
            }}
            setIsExpand={(open) => {
              if (open) setSelectedChart("priority");
              setIsExpand(open);
            }}
            handleExportImage={handleExportImage}
            handleExportPDF={handleExportPDF}
            handleExportCSV={() => {
              handleExportCSV(
                analytics?.taskPriorityArray,
                "Tasks By Priority"
              );
            }}
            ref={taskPriorityRef}
          >
            <TaskPriorityChart
              data={analytics?.taskPriorityArray}
              isLoading={loading.taskPriorityArray}
            />
          </ChartCard>

          <ChartCard
            title="Tasks By Status"
            setIsExpand={(open) => {
              if (open) setSelectedChart("status");
              setIsExpand(open);
            }}
            onRefresh={() => {
              handleRefresh(["taskStatusArray"]);
            }}
            handleExportImage={handleExportImage}
            handleExportPDF={handleExportPDF}
            handleExportCSV={() => {
              handleExportCSV(analytics?.taskStatusArray, "Tasks By Status");
            }}
            ref={taskStatusRef}
          >
            <TaskStatusChart
              data={analytics?.taskStatusArray}
              isLoading={loading.taskStatusArray}
            />
          </ChartCard>

          <ChartCard
            title="Tasks By Members"
            setIsExpand={(open) => {
              if (open) setSelectedChart("member");
              setIsExpand(open);
            }}
            onRefresh={() => {
              handleRefresh(["taskMemberArray"]);
            }}
            handleExportImage={handleExportImage}
            handleExportPDF={handleExportPDF}
            handleExportCSV={() => {
              handleExportCSV(analytics?.taskMemberArray, "Tasks By Members");
            }}
            ref={taskMemberRef}
          >
            <TaskMembersChart
              data={analytics?.taskMemberArray}
              isLoading={loading.taskMemberArray}
            />
          </ChartCard>

          <ChartCard
            title="Tasks By Projects"
            setIsExpand={(open) => {
              if (open) setSelectedChart("project");
              setIsExpand(open);
            }}
            onRefresh={() => {
              handleRefresh(["projectTaskArray"]);
            }}
            handleExportImage={handleExportImage}
            handleExportPDF={handleExportPDF}
            handleExportCSV={() => {
              handleExportCSV(analytics?.projectTaskArray, "Tasks By Projects");
            }}
            ref={projectTasksRef}
          >
            <ProjectTasksChart
              data={analytics?.projectTaskArray}
              isLoading={loading.projectTaskArray}
            />
          </ChartCard>

          <ChartCard
            title="Incomplete Tasks By Members"
            setIsExpand={(open) => {
              if (open) setSelectedChart("incompleteTasks");
              setIsExpand(open);
            }}
            onRefresh={() => {
              handleRefresh(["incompleteTasksByMember"]);
            }}
            handleExportImage={handleExportImage}
            handleExportPDF={handleExportPDF}
            handleExportCSV={() => {
              handleExportCSV(
                analytics?.incompleteTasksByMember,
                "Incomplete Tasks By Members"
              );
            }}
            ref={incompleteTasksByMemberRef}
          >
            <IncompleteTasksByMemberChart
              data={analytics?.incompleteTasksByMember}
              isLoading={loading.incompleteTasksByMember}
            />
          </ChartCard>
        </div>
      </div>

      <ChartDialog
        title="Tasks By Priority"
        open={isExpand && selectedChart === "priority"}
        setOpen={setIsExpand}
      >
        <TaskPriorityChart
          data={analytics?.taskPriorityArray}
          isLoading={loading.taskPriorityArray}
        />
      </ChartDialog>
      <ChartDialog
        title="Tasks By Status"
        open={isExpand && selectedChart === "status"}
        setOpen={setIsExpand}
      >
        <TaskStatusChart
          isDialog={true}
          data={analytics?.taskStatusArray}
          isLoading={loading.taskStatusArray}
        />
      </ChartDialog>
      <ChartDialog
        title="Tasks By Members"
        open={isExpand && selectedChart === "member"}
        setOpen={setIsExpand}
      >
        <TaskMembersChart
          data={analytics?.taskMemberArray}
          isLoading={loading.taskMemberArray}
        />
      </ChartDialog>
      <ChartDialog
        title="Tasks By Projects"
        open={isExpand && selectedChart === "project"}
        setOpen={setIsExpand}
      >
        <ProjectTasksChart
          data={analytics?.projectTaskArray}
          isLoading={loading.projectTaskArray}
        />
      </ChartDialog>
      <ChartDialog
        title="Incomplete Tasks By Members"
        open={isExpand && selectedChart === "incompleteTasks"}
        setOpen={setIsExpand}
      >
        <IncompleteTasksByMemberChart
          data={analytics?.incompleteTasksByMember}
          isLoading={loading.incompleteTasksByMember}
        />
      </ChartDialog>
    </>
  );
};
export default WorkspaceAnalytics;
