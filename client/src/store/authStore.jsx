import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/auth`;

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  signup: async (userData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      set({ loading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response?.data.message || "Signup failed",
        loading: false,
      });
      toast.error(error.response?.data.message);
      throw error;
    }
  },
  verifyemail: async (userData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, userData);
      set({ loading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response?.data.message || "Error in Verify Email",
        loading: false,
      });
      toast.error(error.response?.data.message);
      throw error;
    }
  },
}));
