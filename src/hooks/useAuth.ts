import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    if (token && !user) {
      api
        .get<{ user: Parameters<typeof setAuth>[1] }>('/auth/me')
        .then((res) => setAuth(token, res.data.user))
        .catch(() => clearAuth());
    }
  }, [token, user, setAuth, clearAuth]);

  return { token, user, clearAuth };
}
