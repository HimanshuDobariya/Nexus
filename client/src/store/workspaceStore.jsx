import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/workspaces`;

axios.defaults.withCredentials = true;

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  activeWorkspace: null,
  loading: false,

  setActiveWorkspace: (workspaceId) => {
    set((state) => ({
      activeWorkspace:
        state.workspaces.find((ws) => ws._id === workspaceId) || null,
    }));
    localStorage.setItem("activeWorkspaceId", workspaceId);
  },

  createWorkspace: async (workspaceData) => {
    set({ loading: true });
    try {
      const { data } = await axios.post(`${API_URL}`, workspaceData);
      set((state) => ({
        workspaces: [...state.workspaces, data.workspace],
        activeWorkspace: data.workspace,
        loading: false,
      }));
      localStorage.setItem("activeWorkspaceId", data.workspace._id);
      return data.workspace;
    } catch (error) {
      console.error("Error creating workspace:", error);
      set({ loading: false });
      throw error;
    }
  },

  getWorkSpaces: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${API_URL}`);
      set({ workspaces: data.workspaces, loading: false });

      const storedWorkspaceId = localStorage.getItem("activeWorkspaceId");
      if (storedWorkspaceId) {
        const activeWorkspace = data.workspaces.find(
          (ws) => ws._id === storedWorkspaceId
        );
        if (activeWorkspace) set({ activeWorkspace });
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      set({ loading: false });
      throw error;
    }
  },

  updateWorkspace: async (workspaceId, updatedData) => {
    set({ loading: true });
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
          loading: false,
          workspaces: updatedWorkspaces,
          activeWorkspace:
            state.activeWorkspace?._id === workspaceId
              ? data.workspace
              : state.activeWorkspace,
        };
      });
      return data.workspace;
    } catch (error) {
      console.error("Error updating workspace:", error);
      set({ loading: false });
      throw error;
    }
  },

  deleteWorkspace: async (workspaceId) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${workspaceId}`);

      set((state) => {
        const updatedWorkspaces = state.workspaces.filter(
          (ws) => ws._id !== workspaceId
        );

        const newActiveWorkspace =
          state.activeWorkspace?._id === workspaceId
            ? updatedWorkspaces[0] || null
            : state.activeWorkspace;

        if (newActiveWorkspace) {
          localStorage.setItem("activeWorkspaceId", newActiveWorkspace._id);
        } else {
          localStorage.removeItem("activeWorkspaceId");
        }

        return {
          workspaces: updatedWorkspaces,
          activeWorkspace: newActiveWorkspace,
          loading: false,
        };
      });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      set({ loading: false });
      throw error;
    }
  },
}));
