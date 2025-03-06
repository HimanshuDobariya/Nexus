import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/tasks`;

axios.defaults.withCredentials = true;

export const useTaskStore = create((set) => ({
  tasks: [],

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

  getAllTasks: async (workspaceId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    try {
      const { data } = await axios.get(
        `${API_URL}/workspace/${workspaceId}/all?${queryParams}`
      );
      console.log(data);
      set({ tasks: data?.tasks || [] });
    } catch (error) {
      throw error;
    }
  },
}));
