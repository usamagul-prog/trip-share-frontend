import PublicLayout from '@/components/layout/PublicLayout';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold">About TripShare</h1>
          <p className="text-muted-foreground text-lg">
            Connecting intercity travellers across Pakistan.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Our story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Fuel prices in Pakistan have roughly doubled in recent years. Drivers making the
            Islamabad–Lahore run were spending thousands of rupees on fuel for a nearly-empty
            car, while riders were paying bus fares on crowded coaches with unpredictable
            schedules.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            TripShare was built to fix both problems at once. When a driver splits the fuel cost
            with two or three riders, everyone wins — the driver offsets expenses, the rider
            travels door-to-door for less than a bus ticket, and there's one fewer car on the
            Grand Trunk Road.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How we keep it safe</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
            <li>Every account is tied to a verified Pakistani mobile number (OTP via Firebase).</li>
            <li>After each trip, drivers and riders rate each other. Low-rated accounts are reviewed.</li>
            <li>Drivers can reject booking requests; riders can cancel before departure.</li>
            <li>In-app chat keeps communication on-platform and auditable.</li>
            <li>An admin panel allows the TripShare team to suspend accounts that violate our policies.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Payment model</h2>
          <p className="text-muted-foreground leading-relaxed">
            TripShare is currently a <strong>cash-on-arrival</strong> platform. The fare shown in
            the app is what you pay to the driver directly when the trip ends. We do not charge
            a booking fee or commission. JazzCash and EasyPaisa integration is planned for a
            future release.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For support, partnerships, or press enquiries, reach us at{' '}
            <a href="mailto:hello@tripshare.pk" className="text-primary underline underline-offset-4">
              hello@tripshare.pk
            </a>
            .
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
