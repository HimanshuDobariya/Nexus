import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}`;

axios.defaults.withCredentials = true;

export const useRolesAndMembersStore = create((set) => ({
  members: null,
  roles: null,

  getAllWorkspaceMembers: async (workspceId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/workspaces/${workspceId}/members`
      );
      set({ members: data.members });
    } catch (error) {
      throw error;
    }
  },
  getAvailableRolesAndPermissions: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/roles`);
      set({ roles: data.roles });
      return data.roles;
    } catch (error) {
      throw error;
    }
  },
}));
