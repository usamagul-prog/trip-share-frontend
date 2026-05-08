import { getToken } from 'firebase/messaging';
import { getMessagingInstance } from './firebase';
import api from './api';

export async function requestAndSaveFcmToken(): Promise<void> {
  try {
    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') return;

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) return;

    const messaging = await getMessagingInstance();
    if (!messaging) return;

    const registration = await navigator.serviceWorker.ready;

    registration.active?.postMessage({
      type: 'FIREBASE_CONFIG',
      config: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      },
    });

    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
    if (token) {
      await api.put('/api/auth/fcm-token', { token });
    }
  } catch (err) {
    console.error('[fcm] token registration failed:', err);
  }
}
