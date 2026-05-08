import PublicLayout from '@/components/layout/PublicLayout';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: 1 May 2026</p>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          By creating an account or using TripShare ("the Platform"), you agree to the following terms. Please read them carefully. If you do not agree, do not use the Platform.
        </p>

        {[
          {
            title: '1. Eligibility',
            body: 'You must be at least 18 years old and hold a valid Pakistani mobile number to use TripShare. By registering, you confirm that the information you provide is accurate.',
          },
          {
            title: '2. Drivers',
            body: 'Drivers must hold a valid Pakistani driving licence and road-worthy vehicle. By posting a trip, you confirm that your vehicle is insured and roadworthy. TripShare does not verify documents; you post trips at your own responsibility.',
          },
          {
            title: '3. Riders',
            body: 'Riders must respect the driver\'s vehicle and fellow passengers. Pickup information you provide is shared with the driver only. TripShare is not responsible for arrangements made outside the Platform.',
          },
          {
            title: '4. Payments',
            body: 'All payments are made directly between driver and rider in cash on arrival. TripShare does not process payments and is not responsible for disputes over unpaid fares.',
          },
          {
            title: '5. Cancellations',
            body: 'Riders may cancel a confirmed booking before departure. Drivers may cancel a scheduled trip with notice; repeated last-minute cancellations may result in account suspension. Neither party is entitled to compensation from TripShare for cancellations.',
          },
          {
            title: '6. Prohibited conduct',
            body: 'You may not use TripShare for commercial taxi services, to harass other users, to post false information, or to violate any applicable Pakistani law. Violation may result in immediate account suspension.',
          },
          {
            title: '7. Ratings and reviews',
            body: 'Ratings must reflect genuine trip experiences. Fake, retaliatory, or manipulated ratings violate these Terms and may result in account suspension.',
          },
          {
            title: '8. Liability',
            body: 'TripShare is a platform connecting drivers and riders. We do not operate vehicles, employ drivers, or guarantee the safety of any journey. Your use of the Platform is at your own risk. To the fullest extent permitted by Pakistani law, TripShare is not liable for any injury, loss, or damage arising from trips arranged through the Platform.',
          },
          {
            title: '9. Termination',
            body: 'TripShare may suspend or terminate accounts that violate these Terms without prior notice. You may delete your account at any time by contacting hello@tripshare.pk.',
          },
          {
            title: '10. Changes to these Terms',
            body: 'We may update these Terms periodically. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.',
          },
          {
            title: '11. Governing law',
            body: 'These Terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes will be subject to the exclusive jurisdiction of the courts in Islamabad.',
          },
        ].map(({ title, body }) => (
          <section key={title} className="space-y-2">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </section>
        ))}

        <p className="text-sm text-muted-foreground">
          Questions? Email{' '}
          <a href="mailto:hello@tripshare.pk" className="text-primary underline underline-offset-4">
            hello@tripshare.pk
          </a>
        </p>
      </div>
    </PublicLayout>
  );
}
