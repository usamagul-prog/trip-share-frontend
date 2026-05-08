import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, Car } from 'lucide-react';

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  roles?: ('driver' | 'rider')[];
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: 'Search for a trip',
    description: 'Pick your origin city, destination, and travel date. TripShare will show you available seats posted by drivers on that route.',
    roles: ['rider'],
  },
  {
    icon: MapPin,
    title: 'Set your pickup point',
    description: 'After finding a trip, drop a pin anywhere on the map to tell the driver exactly where to pick you up along the route.',
    roles: ['rider'],
  },
  {
    icon: Car,
    title: 'Post a trip',
    description: 'Tap "Post a Trip" to fill in your route, date, fare per seat, and vehicle details. Riders will send you booking requests.',
    roles: ['driver'],
  },
  {
    icon: Star,
    title: 'Rate your experience',
    description: 'After each completed trip, leave a review. Ratings build trust and help the whole community travel safely.',
  },
];

const STORAGE_KEY = 'tripshare_onboarding_done';

export function OnboardingTour() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (user && !localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, [user]);

  if (!user) return null;

  const role = user.role as 'driver' | 'rider';
  const steps = STEPS.filter((s) => !s.roles || s.roles.includes(role));
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = current?.icon;

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              {Icon && <Icon className="h-7 w-7 text-primary" />}
            </div>
          </div>
          <DialogTitle className="text-center text-lg">{current?.title}</DialogTitle>
          <DialogDescription className="text-center text-sm leading-relaxed">
            {current?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-1.5 mt-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={handleClose} className="flex-1">
            Skip
          </Button>
          <Button size="sm" onClick={handleNext} className="flex-1">
            {isLast ? 'Get started' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
