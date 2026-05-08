import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'tripshare_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-lg md:border"
    >
      <p className="text-sm text-foreground mb-3">
        We use cookies to improve your experience. By continuing you agree to our{' '}
        <Link to="/privacy" className="underline text-primary">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAccept} className="flex-1">
          Accept
        </Button>
        <Button size="sm" variant="outline" onClick={handleDecline} className="flex-1">
          Decline
        </Button>
      </div>
    </div>
  );
}
