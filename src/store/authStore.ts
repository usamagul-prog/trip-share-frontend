import { create } from 'zustand';
import * as Sentry from '@sentry/react';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'driver' | 'rider' | 'admin';
  avatar_url?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  setToken: (token: string) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    Sentry.setUser({ id: user._id, username: user.name });
    set({ token, user });
  },
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  updateUser: (partial) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    }));
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    Sentry.setUser(null);
    set({ token: null, user: null });
  },
}));
