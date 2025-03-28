import { useState, useEffect } from "react";
import axios from "axios";

const useWorkspaceAnalytics = (workspaceId, projectId, selectedYear) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getWorkspaceAnalytics = async () => {
    if (!workspaceId) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/workspaces/${workspaceId}/analytics`,
        {
          params: {
            projectId,
          },
        }
      );
      setTasks(data?.tasks);
      setProjects(data?.projects);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getWorkspaceAnalytics();
  }, [projectId, selectedYear]);

  const totalTasks = tasks?.length;
  const overdueTasks = tasks?.reduce((acc, task) => {
    const isOverdue =
      task.status !== "DONE" && new Date(task.dueDate) < new Date();
    return isOverdue ? acc + 1 : acc;
  }, 0);
  const completedTasks = tasks?.reduce((acc, task) => {
    return task.status === "DONE" ? acc + 1 : acc;
  }, 0);
  const unassignedTasks = tasks?.reduce((acc, task) => {
    return task.assignedTo === null ? acc + 1 : acc;
  }, 0);

  const taskStatusData = tasks?.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || {
      status: task.status,
      count: 0,
    };
    acc[task.status].count++;
    return acc;
  }, {});

  const taskMemberData = tasks.reduce((acc, task) => {
    if (task.assignedTo && task.assignedTo.name) {
      const memberKey = task.assignedTo.name;
      acc[memberKey] = acc[memberKey] || {
        member: task.assignedTo.name,
        count: 0,
      };
      acc[memberKey].count++;
    } else {
      acc["unassigned"] = acc["unassigned"] || {
        member: "Unassigned",
        count: 0,
      };
      acc["unassigned"].count++;
    }
    return acc;
  }, {});

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let count = 0;

  const taskMonthData = tasks?.reduce((acc, task) => {
    const createdAt = new Date(task.createdAt);
    const taskYear = createdAt.getFullYear();
    if (taskYear !== selectedYear) return acc; // Filter tasks for the given year

    if (taskYear === selectedYear) {
      count++;
    }

    const monthIndex = createdAt.getMonth();
    const monthName = months[monthIndex];

    if (task.status === "DONE") {
      acc[monthName].done++;
    } else {
      acc[monthName].pending++;
    }

    return acc;
  }, Object.fromEntries(months.map((month) => [month, { month, pending: 0, done: 0 }])));

  const taskCounts = tasks.reduce((acc, task) => {
    const projectId = task.project._id;
    acc[projectId] = (acc[projectId] || 0) + 1;
    return acc;
  }, {});

  const projectTaskData = projects.map((project) => ({
    project,
    count: taskCounts[project._id] || 0,
  }));

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
    unassignedTasks,
    taskStatusArray: Object.values(taskStatusData),
    taskMemberArray: Object.values(taskMemberData),
    taskMonthArray: Object.values(taskMonthData),
    projectTaskArray: projectTaskData,
  };

  return { getWorkspaceAnalytics, analytics, isLoading };
};

export default useWorkspaceAnalytics;
