import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/workspaces`;

axios.defaults.withCredentials = true;

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  activeWorkspaceId: localStorage.getItem("activeWorkspaceId") || null,

  createWorkspace: async (workspaceData) => {
    try {
      const { data } = await axios.post(`${API_URL}`, workspaceData);
      set((state) => {
        const updatedWorkspaces = [...state.workspaces, data.workspace];
        localStorage.setItem("activeWorkspaceId", data.workspace._id);
        return {
          workspaces: updatedWorkspaces,
          activeWorkspaceId: data.workspace._id,
        };
      });
      return data.workspace;
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  },

  getWorkSpaces: async () => {
    try {
      const { data } = await axios.get(`${API_URL}`);

      set(() => {
        const storedWorkspaceId = localStorage.getItem("activeWorkspaceId");
        const validWorkspace =
          data.workspaces.find((ws) => ws._id === storedWorkspaceId) ||
          data.workspaces[0] ||
          null;

        if (validWorkspace) {
          localStorage.setItem("activeWorkspaceId", validWorkspace._id);
        } else {
          localStorage.removeItem("activeWorkspaceId");
        }

        return {
          workspaces: data.workspaces,
          activeWorkspaceId: validWorkspace?._id || null,
        };
      });
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw error;
    }
  },

  getWorkspaceById: async (workspaceId) => {
    try {
      const { data } = await axios.get(`${API_URL}/${workspaceId}`);
      return data.workspace; // Return the fetched workspace data
    } catch (error) {
      console.error("Error fetching workspace by ID:", error);
      throw error; // Propagate the error for handling in the component
    }
  },

  setActiveWorkspaceId: (workspaceId) => {
    set({ activeWorkspaceId: workspaceId });
    localStorage.setItem("activeWorkspaceId", workspaceId);
  },

  updateWorkspace: async (workspaceId, updatedData) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/${workspaceId}`,
        updatedData
      );
      set((state) => {
        const updatedWorkspaces = state.workspaces.map((ws) =>
          ws._id === workspaceId ? data.workspace : ws
        );

        return {
          workspaces: updatedWorkspaces,
          activeWorkspaceId:
            workspaceId === state.activeWorkspaceId
              ? workspaceId
              : state.activeWorkspaceId,
        };
      });
      return data.workspace;
    } catch (error) {
      console.error("Error updating workspace:", error);
      throw error;
    }
  },

  deleteWorkspace: async (workspaceId, navigate) => {
    try {
      await axios.delete(`${API_URL}/${workspaceId}`);
      set((state) => {
        const updatedWorkspaces = state.workspaces.filter(
          (ws) => ws._id !== workspaceId
        );

        const newActiveWorkspace = updatedWorkspaces[0] || null;
        if (newActiveWorkspace) {
          localStorage.setItem("activeWorkspaceId", newActiveWorkspace._id);
        } else {
          localStorage.removeItem("activeWorkspaceId");
        }

        if (navigate) {
          navigate(
            newActiveWorkspace
              ? `/workspaces/${newActiveWorkspace._id}`
              : "/workspaces/create"
          );
        }
        return {
          workspaces: updatedWorkspaces,
          activeWorkspaceId: newActiveWorkspace?._id || null,
        };
      });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      throw error;
    }
  },
}));
