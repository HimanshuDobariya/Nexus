import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/auth`;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,

  signup: async (userData) => {
    set({ loading: true });

    try {
      await axios.post(`${API_URL}/signup`, userData);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  verifyemail: async (userData) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.post(`${API_URL}/verify-email`, userData);
      set({ loading: false, isAuthenticated: true, user: data.user });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  login: async (userData) => {
    set({ loading: true });

    try {
      await axios.post(`${API_URL}/login`, userData);
      set({ loading: false, isAuthenticated: true });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ loading: false, isAuthenticated: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  forgotPassword: async (userData) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/forgot-password`, userData);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  resetPassword: async (userData, token) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/reset-password/${token}`, userData);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isAuthenticated: false });
    try {
      const { data } = await axios.get(`${API_URL}/check-auth`);
      if (data.user) {
        set({
          isAuthenticated: true,
          user: data.user,
        });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
