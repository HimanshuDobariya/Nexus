import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { persist } from "zustand/middleware";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/auth`;

axios.defaults.withCredentials = true;

export const useAuthStore = create(
  persist((set) => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    signup: async (userData) => {
      set({ loading: true, error: null });

      try {
        const { data } = await axios.post(`${API_URL}/signup`, userData);
        set({ loading: false });
        toast.success(data.message);
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
        const { data } = await axios.post(`${API_URL}/verify-email`, userData);
        set({ loading: false, isAuthenticated: true, user: data.user });
        toast.success(data.message);
      } catch (error) {
        set({
          error: error.response?.data.message || "Error in Verify Email",
          loading: false,
        });
        toast.error(error.response?.data.message);
        throw error;
      }
    },
    login: async (userData) => {
      set({ loading: true, error: null });

      try {
        const { data } = await axios.post(`${API_URL}/login`, userData);
        set({ loading: false, isAuthenticated: true });
        toast.success(data.message);
      } catch (error) {
        set({
          error: error.response?.data.message || "Error in Login",
          loading: false,
        });
        toast.error(error.response?.data.message);
        throw error;
      }
    },

    logout: async () => {
      set({ loading: true, error: null });
      try {
        const { data } = await axios.post(`${API_URL}/logout`);
        set({ loading: false, isAuthenticated: false });
        toast.success(data.message);
      } catch (error) {
        set({
          error: error.response?.data.message || "Error in logout",
          loading: false,
        });
        toast.error(error.response?.data.message);
        throw error;
      }
    },

    forgotPassword: async (userData) => {
      set({ loading: true, error: null });
      try {
        const { data } = await axios.post(
          `${API_URL}/forgot-password`,
          userData
        );
        set({ loading: false });
        toast.success(data.message);
      } catch (error) {
        set({
          error:
            error.response?.data.message || "Error to sent reset password link",
          loading: false,
        });
        toast.error(error.response?.data.message);
        throw error;
      }
    },

    resetPassword: async (userData, token) => {
      set({ loading: true, error: null });
      try {
        const { data } = await axios.post(
          `${API_URL}/reset-password/${token}`,
          userData
        );
        set({ loading: false });
        toast.success(data.message);
      } catch (error) {
        set({
          error: error.response?.data.message || "Error in reset password",
          loading: false,
        });
        toast.error(error.response?.data.message);
        throw error;
      }
    },

    checkAuth: async () => {
      set({ isCheckingAuth: true, error: null });
      try {
        const { data } = await axios.get(`${API_URL}/check-auth`);
        if (data.user) {
          set({
            isCheckingAuth: false,
            isAuthenticated: true,
            user: data.user,
          });
        } else {
          set({ isCheckingAuth: false, isAuthenticated: false, user: null });
        }
      } catch (error) {
        set({
          user: null,
          isCheckingAuth: false,
          isAuthenticated: false,
        });
      }
    },
  }))
);
