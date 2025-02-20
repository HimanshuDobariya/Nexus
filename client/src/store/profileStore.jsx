import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/profile`;

axios.defaults.withCredentials = true;

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,

  getProfile: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${API_URL}`);
      set({ loading: false, profile: data.profile });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  updateProfile: async (userData) => {
    set({ loading: true });
    try {
      const { data } = await axios.put(`${API_URL}`, userData);
      set({ loading: false, profile: data.profile });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
