import { create } from "zustand";

export const useNavigationStore = create((set) => ({
  lastVisitedRoute: null,
  setLastVisitedRoute: (route) => set({ lastVisitedRoute: route }),
}));
