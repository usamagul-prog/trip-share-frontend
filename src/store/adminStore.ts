import { create } from 'zustand';

interface AdminState {
  adminToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  adminToken: localStorage.getItem('admin_token'),
  login: (token) => {
    localStorage.setItem('admin_token', token);
    set({ adminToken: token });
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    set({ adminToken: null });
  },
}));
