import { create } from 'zustand';
import axios from 'axios';

interface AuthStore {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const TOKEN_KEY = 'radio_admin_token';
const USER_KEY = 'radio_admin_user';

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  username: localStorage.getItem(USER_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || '/api'}/auth/login`,
        { username, password }
      );
      const { token, username: user } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, user);
      set({ token, username: user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error al conectar con el servidor';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, username: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
