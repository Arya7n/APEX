"use client";

import { create } from "zustand";
import type { User } from "@/lib/types";
import * as api from "@/lib/api";

interface AuthState {
  user: User | null; ready: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const saveRefresh = (token?: string) => {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("apex_refresh_token", token); else localStorage.removeItem("apex_refresh_token");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null, ready: false,
  hydrate: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("apex_refresh_token") : null;
    if (!token) { set({ ready: true }); return; }
    try { const result = await api.refreshAuth(token); saveRefresh(result.refreshToken ?? token); set({ user: result.user, ready: true }); }
    catch { saveRefresh(); set({ user: null, ready: true }); }
  },
  login: async (email, password) => { const result = await api.login(email, password); saveRefresh(result.refreshToken); set({ user: result.user, ready: true }); },
  register: async (email, password, name) => { const result = await api.register(email, password, name); saveRefresh(result.refreshToken); set({ user: result.user, ready: true }); },
  logout: async () => { try { await api.logout(); } finally { saveRefresh(); set({ user: null, ready: true }); } },
}));
