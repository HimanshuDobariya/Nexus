import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/tasks`;

axios.defaults.withCredentials = true;

export const useTaskStore = create((set, get) => ({
  tasks: [],
  workspaceId: null,
  projectId: null,
  filters: {
    status: "",
    priority: "",
    assignedTo: "",
    keyword: "",
    dueDate: "",
  },
  pageNumber: 1,
  pageSize: 10,
  currentTab: "table",

  setWorkspaceProject: (workspaceId, projectId) =>
    set({ workspaceId, projectId }),
  setFilters: (filters) =>
    set((state) => ({
      filters: typeof filters === "function" ? filters(state.filters) : filters,
    })),
  setPagination: (pageNumber, pageSize) => set({ pageNumber, pageSize }),
  setCurrentTab: (tab) => set({ currentTab: tab }),

  createTask: async (workspaceId, projectId, taskData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/project/${projectId}/workspace/${workspaceId}/create`,
        taskData
      );
      set((state) => ({
        tasks: [...state.tasks, data.task],
      }));
      return data.task;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllTasks: async (workspaceId, projectId) => {
    const { filters, pageNumber, pageSize, currentTab } = get(); // Get the current state

    const params = { ...filters };

    if (currentTab === "table") {
      params.pageNumber = pageNumber;
      params.pageSize = pageSize;
    }

    const queryParams = new URLSearchParams(params).toString();

    try {
      const { data } = await axios.get(
        `${API_URL}/project/${projectId}/workspace/${workspaceId}/all?${queryParams}`
      );
      set({ tasks: data.tasks || [] }); // Set tasks in the store
      return data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  getTaskById: async (workspaceId, projectId, taskId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/${taskId}/project/${projectId}/workspace/${workspaceId}`
      );
      return data.task;
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (workspaceId, projectId, taskId, taskData) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/${taskId}/project/${projectId}/workspace/${workspaceId}/update`,
        taskData
      );
      set((state) => {
        const updatedTasks = state.tasks.map((task) =>
          task._id === taskId ? data.task : task
        );
        return { tasks: updatedTasks };
      });
      return data.task;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deleteTask: async (workspaceId, projectId, taskId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/${taskId}/project/${projectId}/workspace/${workspaceId}/delete`
      );
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
      }));
      return data.task;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
