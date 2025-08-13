import Cookies from "js-cookie";
import { create } from "zustand";

interface AuthUser {
  id: number;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("auth-token") || null,
  login: (token, user) => {
    Cookies.set("auth-token", token, { expires: 7, path: "/" });
    set({ token, user });
  },
  logout: () => {
    Cookies.remove("auth-token", { path: "/" });
    set({ token: null, user: null });
  },
  setUser: (user) => set({ user }),
}));
