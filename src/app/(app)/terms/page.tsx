import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-6 text-background">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Terms of Service
      </h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          1. Use of Service
        </h2>
        <p>
          Brochurify lets you build and host single-page websites. You agree not
          to use the service for illegal activities, spam, copyright
          infringement, or malicious content. We reserve the right to suspend
          accounts violating these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          2. Accounts & Access
        </h2>
        <p>
          You're responsible for your account activity. Currently, Only gmail
          login is applied to register into the app. Keep your access to
          yourself to prevent breaches.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          3. Subscription & Payments
        </h2>
        <p>
          Paid plans are billed upfront, monthly. Prices may change, and we'll
          notify you ahead of time. Continued use means you accept the new
          prices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          4. Refund Policy
        </h2>
        <p>
          <strong>Monthly plans:</strong> No refunds for past months. Cancel
          anytime to stop future billing. <br />
          No refunds for accounts suspended due to abuse or policy violations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          5. Privacy Policy
        </h2>
        <p>
          We collect only essential information: email, payment data, and
          content you create. We do not sell or share your personal data.
          Whenever you wish to remove your data permanently, you can delete your
          account and all your saved data will be deleted.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          6. Content Ownership
        </h2>
        <p>
          You retain full ownership of your content. By using Brochurify, you
          grant us permission to host and serve your site. We reserve the right
          to remove content violating laws or these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          7. Service Availability
        </h2>
        <p>
          We aim for reliable uptime, but outages may occur. We’re not liable
          for any downtime, data loss, or indirect damages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          8. Termination
        </h2>
        <p>
          You can cancel at any time. We may suspend or terminate accounts for
          violations, suspected fraud, or legal reasons.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          9. Updates to Terms
        </h2>
        <p>
          We may update these terms from time to time. We’ll notify you of
          significant changes. Continued use means you accept the revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          10. Contact
        </h2>
        <p>
          Questions? Contact us{" "}
          <span>
            <Link href="/contact" className="underline">
              here
            </Link>
          </span>
          .
        </p>
      </section>
    </main>
  );
}
