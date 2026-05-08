import PublicLayout from '@/components/layout/PublicLayout';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: 1 May 2026</p>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          TripShare ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights.
        </p>

        {[
          {
            title: '1. Information we collect',
            items: [
              'Mobile phone number (collected during registration via Firebase OTP)',
              'Full name and preferred role (driver or rider)',
              'Profile photo (optional, stored on Cloudinary)',
              'Trip details you post or bookings you make',
              'Ratings and reviews you give or receive',
              'In-app chat messages between driver and rider',
              'Device token for push notifications (via Firebase Cloud Messaging)',
            ],
          },
          {
            title: '2. How we use your information',
            items: [
              'To create and authenticate your account',
              'To match drivers and riders on the same route',
              'To send trip confirmations and push notifications',
              'To display your name and rating to other users on shared trips',
              'To enforce our Terms of Service and investigate abuse reports',
            ],
          },
          {
            title: '3. Information shared with other users',
            items: [
              'Your name, role, and average rating are visible to any user on the same trip',
              'Your custom pickup text is visible to the driver of your booked trip only',
              'Chat messages are visible to both parties in the conversation',
            ],
          },
          {
            title: '4. Third-party services',
            items: [
              'Firebase Authentication & Cloud Messaging (Google LLC) — phone verification and push notifications',
              'Cloudinary — profile photo storage',
              'Railway / Vercel — infrastructure hosting',
              'MongoDB Atlas — database hosting',
            ],
          },
        ].map(({ title, items }) => (
          <section key={title} className="space-y-2">
            <h2 className="font-semibold">{title}</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {items.map((item) => <li key={item} className="leading-relaxed">{item}</li>)}
            </ul>
          </section>
        ))}

        {[
          {
            title: '5. Data retention',
            body: 'We retain your account data for as long as your account is active. You may request deletion by emailing hello@tripshare.pk. Trip and booking records may be retained for up to 12 months for fraud prevention.',
          },
          {
            title: '6. Security',
            body: 'All traffic is encrypted in transit via HTTPS. Passwords are never stored (we use phone-number OTP only). JWT tokens expire within 7 days.',
          },
          {
            title: '7. Children',
            body: 'TripShare is not directed at persons under 18. If you believe a minor has created an account, contact us immediately and we will delete it.',
          },
          {
            title: '8. Your rights',
            body: 'You may request access to, correction of, or deletion of your personal data by emailing hello@tripshare.pk. We will respond within 30 days.',
          },
          {
            title: '9. Changes to this policy',
            body: 'We may update this Privacy Policy from time to time. Material changes will be notified in-app. Continued use of TripShare after the effective date constitutes acceptance.',
          },
          {
            title: '10. Contact',
            body: 'For privacy-related questions, email hello@tripshare.pk.',
          },
        ].map(({ title, body }) => (
          <section key={title} className="space-y-2">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </PublicLayout>
  );
}
