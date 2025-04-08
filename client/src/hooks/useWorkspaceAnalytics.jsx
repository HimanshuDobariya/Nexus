import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useWorkspaceAnalytics = (workspaceId, projectId) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const initialAnalytics = {
    totalTasks: 0,
    overdueTasks: 0,
    completedTasks: 0,
    unassignedTasks: 0,
    taskPriorityArray: [],
    taskStatusArray: [],
    taskMemberArray: [],
    projectTaskArray: [],
    incompleteTasksByMember: [],
  };

  const [analyticsData, setAnalyticsData] = useState(initialAnalytics);
  const [loadingStates, setLoadingStates] = useState(
    Object.fromEntries(Object.keys(initialAnalytics).map((key) => [key, false]))
  );

  const setLoading = useCallback((keys, isLoading) => {
    const updates = Array.isArray(keys) ? keys : [keys];
    setLoadingStates((prev) => {
      const updated = { ...prev };
      updates.forEach((key) => (updated[key] = isLoading));
      return updated;
    });
  }, []);

  const calculateAnalytics = useCallback((keys, tasksData, projectsData) => {
    const updates = {};

    if (keys.includes("totalTasks")) {
      updates.totalTasks = tasksData.length;
    }

    if (keys.includes("overdueTasks")) {
      updates.overdueTasks = tasksData.filter(
        (task) => task.status !== "DONE" && new Date(task.dueDate) < new Date()
      ).length;
    }

    if (keys.includes("completedTasks")) {
      updates.completedTasks = tasksData.filter(
        (task) => task.status === "DONE"
      ).length;
    }

    if (keys.includes("unassignedTasks")) {
      updates.unassignedTasks = tasksData.filter(
        (task) => !task.assignedTo
      ).length;
    }

    if (keys.includes("taskPriorityArray")) {
      updates.totalTasks = tasksData.length;
      updates.taskPriorityArray = Object.values(
        tasksData.reduce((acc, task) => {
          acc[task.priority] = acc[task.priority] || {
            priority: task.priority,
            count: 0,
            percentage: 0,
          };
          acc[task.priority].count++;
          acc[task.priority].percentage = (
            (acc[task.priority].count / updates.totalTasks) *
            100
          ).toFixed(2);
          return acc;
        }, {})
      );
    }

    if (keys.includes("taskStatusArray")) {
      updates.taskStatusArray = Object.values(
        tasksData.reduce((acc, task) => {
          acc[task.status] = acc[task.status] || {
            status: task.status,
            count: 0,
          };
          acc[task.status].count++;
          return acc;
        }, {})
      );
    }

    if (keys.includes("taskMemberArray")) {
      updates.taskMemberArray = Object.values(
        tasksData.reduce((acc, task) => {
          const member = task.assignedTo?.name || "Unassigned";
          acc[member] = acc[member] || { member, count: 0 };
          acc[member].count++;
          return acc;
        }, {})
      );
    }

    if (keys.includes("incompleteTasksByMember")) {
      const filteredTasks = tasksData.filter(
        (task) => task.status !== "DONE" && task.assignedTo
      );

      const totalIncompleteAssigned = filteredTasks.length;

      const memberMap = filteredTasks.reduce((acc, task) => {
        const member = task.assignedTo.name;
        const status = task.status;

        if (!acc[member]) {
          acc[member] = {
            member,
            count: 0,
            percentage: 0,
            statusCounts: {},
          };
        }

        acc[member].count++;
        acc[member].statusCounts[status] =
          (acc[member].statusCounts[status] || 0) + 1;

        return acc;
      }, {});

      updates.incompleteTasksByMember = Object.values(memberMap).map(
        (entry) => ({
          ...entry,
          percentage: ((entry.count / totalIncompleteAssigned) * 100).toFixed(
            2
          ),
        })
      );
    }

    if (keys.includes("projectTaskArray") && projectsData) {
      const countMap = tasksData.reduce((acc, task) => {
        const id = task.project?._id;
        if (id) acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      updates.projectTaskArray = projectsData.map((project) => ({
        project: project.name,
        count: countMap[project._id] || 0,
      }));
    }

    setAnalyticsData((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchTasks = useCallback(
    async (keys) => {
      if (!workspaceId) return;
      setLoading(["tasks", ...keys], true);

      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/workspaces/${workspaceId}/analytics`,
          { params: { projectId } }
        );

        const newTasks = data.tasks || [];
        setTasks(newTasks);
        return newTasks;
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return [];
      } finally {
        setLoading(["tasks", ...keys], false);
      }
    },
    [workspaceId, projectId, setLoading]
  );

  const fetchProjects = useCallback(
    async (keys, tasksData = []) => {
      if (!workspaceId) return;
      setLoading(["projects", ...keys], true);

      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/workspaces/${workspaceId}/analytics`,
          { params: { projectId } }
        );

        const newProjects = data.projects || [];
        setProjects(newProjects);
        calculateAnalytics(keys, tasksData, newProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(["projects", ...keys], false);
      }
    },
    [workspaceId, projectId, calculateAnalytics, setLoading]
  );

  useEffect(() => {
    const loadAnalytics = async () => {
      const taskKeys = [
        "totalTasks",
        "overdueTasks",
        "completedTasks",
        "unassignedTasks",
        "taskPriorityArray",
        "taskStatusArray",
        "taskMemberArray",
        "incompleteTasksByMember",
      ];
      const projectKeys = ["projectTaskArray"];

      const taskData = await fetchTasks(taskKeys);
      await fetchProjects(projectKeys, taskData);
      calculateAnalytics(taskKeys, taskData, projects);
    };

    if (workspaceId) loadAnalytics();
  }, [workspaceId, projectId]);

  const handleRefresh = useCallback(
    async (keys = []) => {
      const projectKeys = keys.filter((k) => k === "projectTaskArray");
      const taskKeys = keys.filter((k) => k !== "projectTaskArray");

      const taskData = taskKeys.length ? await fetchTasks(taskKeys) : tasks;
      if (projectKeys.length) await fetchProjects(projectKeys, taskData);
      if (taskKeys.length) calculateAnalytics(taskKeys, taskData, projects);
    },
    [fetchTasks, fetchProjects, calculateAnalytics, tasks, projects]
  );

  return {
    handleRefresh,
    loading: loadingStates,
    analytics: analyticsData,
  };
};

export default useWorkspaceAnalytics;
