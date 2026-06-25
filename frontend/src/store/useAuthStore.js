import { create } from 'zustand';
import { getMe, logout as apiLogout } from '../api/auth';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const res = await getMe();
      set({ user: res.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  setUser: (user) => set({ user, loading: false }),

  logout: async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    set({ user: null });
  },
}));

export default useAuthStore;
