import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { requestAndSaveFcmToken } from '@/lib/fcmClient';

export function useFcmSetup() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    requestAndSaveFcmToken();
  }, [user?._id]);
}
