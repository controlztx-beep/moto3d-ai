import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <h1 className="font-display mb-4 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground">
              MOTO3D AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 3D motorcycle configurator platform and related services (collectively, the &quot;Service&quot;).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
            
            <h3 className="mb-2 text-xl font-semibold">2.1 Information You Provide</h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Account Information:</strong> Name, email address, password, company name</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store credit card numbers)</li>
              <li><strong>Profile Data:</strong> Organization details, preferences, and settings</li>
              <li><strong>User Content:</strong> Motorcycle configurations, customizations, saved designs, and shared content</li>
            </ul>

            <h3 className="mb-2 mt-4 text-xl font-semibold">2.2 Information Collected Automatically</h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, interactions with 3D models</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Analytics Data:</strong> Configuration events, color changes, part selections, AI chat interactions</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="mb-4 text-muted-foreground">We use the collected information for:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Service Delivery:</strong> Providing and maintaining the configurator platform</li>
              <li><strong>Account Management:</strong> Creating and managing your account, authentication</li>
              <li><strong>Payment Processing:</strong> Processing subscriptions and billing through Stripe</li>
              <li><strong>Personalization:</strong> Customizing your experience, saving preferences</li>
              <li><strong>AI Features:</strong> Providing AI-powered recommendations and chat assistance</li>
              <li><strong>Analytics:</strong> Understanding usage patterns, improving features</li>
              <li><strong>Communication:</strong> Sending service updates, security alerts, marketing (with consent)</li>
              <li><strong>Security:</strong> Detecting fraud, preventing abuse, ensuring platform security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. Data Storage and Security</h2>
            <p className="mb-4 text-muted-foreground">
              Your data is stored securely using industry-standard practices:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Database:</strong> Supabase (PostgreSQL) with encryption at rest</li>
              <li><strong>Authentication:</strong> Supabase Auth with secure password hashing</li>
              <li><strong>Hosting:</strong> Vercel with SSL/TLS encryption in transit</li>
              <li><strong>Backups:</strong> Regular automated backups with 30-day retention</li>
              <li><strong>Access Control:</strong> Role-based access, multi-factor authentication available</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Third-Party Services</h2>
            <p className="mb-4 text-muted-foreground">We use the following third-party services:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Supabase:</strong> Database and authentication - <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><strong>Stripe:</strong> Payment processing - <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><strong>Google AI:</strong> AI-powered features - <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><strong>Vercel:</strong> Hosting and deployment - <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Cookies and Tracking</h2>
            <p className="mb-4 text-muted-foreground">We use cookies for:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
              <li><strong>Preference Cookies:</strong> Remembering your settings and choices</li>
              <li><strong>Analytics Cookies:</strong> Understanding how you use the platform</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              You can control cookies through your browser settings, but disabling essential cookies may affect functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Data Sharing and Disclosure</h2>
            <p className="mb-4 text-muted-foreground">We do not sell your personal information. We may share data:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              <li><strong>Service Providers:</strong> Third parties who assist in operating our service</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
              <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
              <li><strong>Public Configurations:</strong> Configurations you choose to share publicly</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Your Rights</h2>
            <p className="mb-4 text-muted-foreground">You have the right to:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a structured format</li>
              <li><strong>Objection:</strong> Opt-out of marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              To exercise these rights, contact us at <a href="mailto:contact@moto3d.ai" className="text-primary hover:underline">contact@moto3d.ai</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for legal compliance, fraud prevention, and legitimate business purposes for up to 90 days, after which it is permanently deleted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">11. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for users under 16 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">12. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy periodically. We will notify you of material changes via email or prominent notice on our platform. Continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">13. Contact Us</h2>
            <p className="text-muted-foreground">
              For questions about this Privacy Policy or our data practices, contact us:
            </p>
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
              <p className="font-semibold">MOTO3D AI</p>
              <p className="text-muted-foreground">Email: <a href="mailto:contact@moto3d.ai" className="text-primary hover:underline">contact@moto3d.ai</a></p>
              <p className="text-muted-foreground">Website: <a href="https://moto3d-ai.vercel.app" className="text-primary hover:underline">moto3d-ai.vercel.app</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
