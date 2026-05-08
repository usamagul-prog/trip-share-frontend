import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;

function isAnalyticsAllowed(): boolean {
  try {
    return localStorage.getItem('tripshare_cookie_consent') === 'accepted';
  } catch {
    return false;
  }
}

function trackPageview(url: string): void {
  if (!PLAUSIBLE_DOMAIN || !isAnalyticsAllowed()) return;
  if (typeof window === 'undefined') return;

  fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'pageview',
      url: `https://${PLAUSIBLE_DOMAIN}${url}`,
      domain: PLAUSIBLE_DOMAIN,
      referrer: document.referrer || null,
      screen_width: window.screen.width,
    }),
  }).catch(() => undefined);
}

export function usePlausible(): void {
  const location = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (path !== prevPath.current) {
      prevPath.current = path;
      trackPageview(path);
    }
  }, [location.pathname, location.search]);
}
