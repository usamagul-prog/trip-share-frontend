import { Car, Search, MessageSquare, Star, CreditCard } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

const DRIVER_STEPS = [
  { icon: Car, title: 'Post your trip', desc: 'Enter your origin city, destination, departure date and time, number of available seats, and the fare per seat.' },
  { icon: MessageSquare, title: 'Receive booking requests', desc: 'Riders in your route will send booking requests. You can view each rider\'s profile and rating before accepting.' },
  { icon: Star, title: 'Complete the trip and rate', desc: 'Once you arrive, collect the fare in cash. Then rate your rider — your feedback helps keep the community safe.' },
];

const RIDER_STEPS = [
  { icon: Search, title: 'Search for a trip', desc: 'Choose your origin city, destination, and travel date. TripShare shows you all available trips sorted by departure time.' },
  { icon: MessageSquare, title: 'Book and specify pickup', desc: 'Select a trip, enter your exact pickup point in text (e.g. "outside Centaurus Mall gate 2"), and send your request.' },
  { icon: CreditCard, title: 'Pay on arrival', desc: 'The driver confirms your request. Travel together, pay the driver the agreed fare in cash when you arrive.' },
];

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold">How TripShare works</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            TripShare connects drivers with empty seats to riders heading the same way. Here's how both sides of the journey work.
          </p>
        </div>

        {/* For drivers */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Car className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">For drivers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {DRIVER_STEPS.map((step, i) => (
              <div key={step.title} className="border rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For riders */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">For riders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {RIDER_STEPS.map((step, i) => (
              <div key={step.title} className="border rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can a rider cancel a booking?',
                a: 'Yes. Riders can cancel a confirmed booking from the My Bookings screen any time before the trip departs.',
              },
              {
                q: 'What if the driver cancels last minute?',
                a: 'When a driver cancels a scheduled trip, all confirmed riders receive an in-app notification immediately so they can find an alternative.',
              },
              {
                q: 'How is the fare calculated?',
                a: 'Drivers set their own fare per seat when posting a trip. There is no platform fee on top of that amount.',
              },
              {
                q: 'Is TripShare available outside Pakistan?',
                a: 'Currently TripShare covers intercity routes within Pakistan only.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border rounded-xl p-5 space-y-2">
                <h3 className="font-semibold text-sm">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
