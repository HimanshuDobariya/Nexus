import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/workspaces`;

axios.defaults.withCredentials = true;

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  loading: false,
  currentWorkspace: null,
  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
  },

  createWorkspace: async (userData) => {
    set({ loading: true });
    try {
      const { data } = await axios.post(`${API_URL}`, userData);
      set((state) => ({
        loading: false,
        workspaces: [...state.workspaces, data.workspace],
        currentWorkspace: data.workspace,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getWorkSpaces: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${API_URL}`);
      set({
        loading: false,
        workspaces: data.workspaces,
        currentWorkspace:
          data.workspaces.length > 0
            ? data.workspaces[data.workspaces.length - 1]
            : null,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
