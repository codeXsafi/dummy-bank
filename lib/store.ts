/*
 * lib/store.ts — Zustand store holding the authenticated session.
 */
import { create } from "zustand";

export type Role = "maker" | "viewer";

interface AuthState {
  token: string | null;
  role: Role | null;
  email: string | null;

  login: (token: string, role: Role, email: string) => void;
  // Called by the idle-session timeout and by an explicit logout action.
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  email: null,
  login: (token, role, email) => set({ token, role, email }),
  logout: () => set({ token: null, role: null, email: null }),
}));

interface PageTitleState {
  title: string;
  setTitle: (title: string) => void;
}

// Holds the current page title so Header can render it — pages push their
// own title in via usePageTitle() instead of Header hardcoding one.
export const usePageTitleStore = create<PageTitleState>((set) => ({
  title: "",
  setTitle: (title) => set({ title }),
}));
