import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/projects`;

axios.defaults.withCredentials = true;

export const useProjectStore = create((set) => ({
  projects: [],

  createProject: async (workspaceId, userData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/workspace/${workspaceId}/create`,
        userData
      );
      set((state) => ({
        projects: [...state.projects, data.project],
      }));
      return data.project;
    } catch (error) {
      throw error;
    }
  },

  getAllProjects: async (workspaceId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/workspace/${workspaceId}/all`
      );
      set({ projects: data?.projects || [] });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getProjectById: async (projectId, workspaceId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/${projectId}/workspace/${workspaceId}`
      );
      set((state) => ({
        projects: state.projects,
      }));
      return data.project;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateProject: async (projectId, workspaceId, projectdata) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/${projectId}/workspace/${workspaceId}/update`,
        projectdata
      );
      set((state) => {
        const updatedProjects = state.projects.map((project) =>
          project._id === projectId ? data.project : project
        );
        return { projects: updatedProjects };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deleteProject: async (projectId, workspaceId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/${projectId}/workspace/${workspaceId}/delete`
      );
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== projectId),
      }));
      return data.project;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
