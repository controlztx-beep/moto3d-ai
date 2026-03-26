import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <h1 className="font-display mb-4 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using MOTO3D AI (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and MOTO3D AI.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              MOTO3D AI provides a cloud-based 3D motorcycle configurator platform that enables users to visualize, customize, and share motorcycle configurations. The Service includes:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Real-time 3D motorcycle visualization and customization</li>
              <li>AI-powered recommendations and assistance</li>
              <li>Configuration saving, sharing, and embedding</li>
              <li>Analytics and reporting tools</li>
              <li>API access (on applicable plans)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. Account Terms</h2>
            
            <h3 className="mb-2 text-xl font-semibold">3.1 Account Creation</h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>You must be at least 16 years old to use the Service</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You are responsible for all activities under your account</li>
              <li>One person or entity may not maintain multiple free accounts</li>
            </ul>

            <h3 className="mb-2 mt-4 text-xl font-semibold">3.2 Account Security</h3>
            <p className="text-muted-foreground">
              You must immediately notify us of any unauthorized use of your account. We are not liable for losses caused by unauthorized use of your credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. Subscription and Payment</h2>
            
            <h3 className="mb-2 text-xl font-semibold">4.1 Subscription Plans</h3>
            <p className="mb-4 text-muted-foreground">
              We offer multiple subscription tiers (Free, Professional, Business, Enterprise). Features and limitations vary by plan as described on our pricing page.
            </p>

            <h3 className="mb-2 text-xl font-semibold">4.2 Billing</h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Subscriptions are billed in advance on a monthly or annual basis</li>
              <li>All fees are in USD and non-refundable except as required by law</li>
              <li>You authorize us to charge your payment method for all fees</li>
              <li>Prices may change with 30 days notice to existing subscribers</li>
              <li>Failed payments may result in service suspension or termination</li>
            </ul>

            <h3 className="mb-2 mt-4 text-xl font-semibold">4.3 Upgrades and Downgrades</h3>
            <p className="text-muted-foreground">
              Plan changes take effect immediately. Upgrades are prorated; downgrades take effect at the next billing cycle. Downgrading may result in loss of features or data.
            </p>

            <h3 className="mb-2 mt-4 text-xl font-semibold">4.4 Cancellation and Refunds</h3>
            <p className="text-muted-foreground">
              You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. We do not provide refunds for partial months or unused time, except as required by law or at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Acceptable Use</h2>
            
            <h3 className="mb-2 text-xl font-semibold">5.1 Permitted Use</h3>
            <p className="mb-4 text-muted-foreground">
              You may use the Service for lawful business purposes in accordance with these Terms.
            </p>

            <h3 className="mb-2 text-xl font-semibold">5.2 Prohibited Activities</h3>
            <p className="mb-4 text-muted-foreground">You agree NOT to:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Use the Service to compete with us or build similar products</li>
              <li>Scrape, crawl, or harvest data without permission</li>
              <li>Overload or interfere with Service infrastructure</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Use the Service for illegal or fraudulent purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Intellectual Property</h2>
            
            <h3 className="mb-2 text-xl font-semibold">6.1 Our IP</h3>
            <p className="mb-4 text-muted-foreground">
              The Service, including all software, designs, graphics, text, and 3D models, is owned by MOTO3D AI and protected by copyright, trademark, and other intellectual property laws. You receive a limited, non-exclusive, non-transferable license to use the Service.
            </p>

            <h3 className="mb-2 text-xl font-semibold">6.2 Your Content</h3>
            <p className="mb-4 text-muted-foreground">
              You retain ownership of configurations and content you create. By using the Service, you grant us a worldwide, royalty-free license to host, store, and display your content as necessary to provide the Service.
            </p>

            <h3 className="mb-2 text-xl font-semibold">6.3 Feedback</h3>
            <p className="text-muted-foreground">
              Any feedback, suggestions, or ideas you provide become our property and may be used without compensation or attribution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Privacy and Data</h2>
            <p className="text-muted-foreground">
              Your use of the Service is governed by our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. By using the Service, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Service Availability</h2>
            <p className="mb-4 text-muted-foreground">
              We strive for 99.9% uptime but do not guarantee uninterrupted access. The Service may be unavailable due to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Scheduled maintenance (with advance notice when possible)</li>
              <li>Emergency maintenance or security updates</li>
              <li>Third-party service outages</li>
              <li>Force majeure events beyond our control</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Limitation of Liability</h2>
            <p className="mb-4 text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND</li>
              <li>WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES</li>
              <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE LAST 12 MONTHS</li>
              <li>WE ARE NOT LIABLE FOR DATA LOSS, BUSINESS INTERRUPTION, OR LOST PROFITS</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless MOTO3D AI from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">11. Termination</h2>
            
            <h3 className="mb-2 text-xl font-semibold">11.1 By You</h3>
            <p className="mb-4 text-muted-foreground">
              You may terminate your account at any time through account settings or by contacting support.
            </p>

            <h3 className="mb-2 text-xl font-semibold">11.2 By Us</h3>
            <p className="mb-4 text-muted-foreground">
              We may suspend or terminate your account immediately if you:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Violate these Terms</li>
              <li>Fail to pay fees</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Pose a security risk to the Service</li>
            </ul>

            <h3 className="mb-2 mt-4 text-xl font-semibold">11.3 Effect of Termination</h3>
            <p className="text-muted-foreground">
              Upon termination, your right to use the Service ceases immediately. We may delete your data after 30 days. Provisions that should survive termination (payment obligations, IP rights, limitations of liability) remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">12. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these Terms at any time. Material changes will be notified via email or prominent notice. Continued use after changes constitutes acceptance. If you disagree with changes, you must stop using the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">13. Governing Law and Disputes</h2>
            <p className="mb-4 text-muted-foreground">
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles. Any disputes shall be resolved through:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Good faith negotiation</li>
              <li>Binding arbitration (if negotiation fails)</li>
              <li>Courts of [Your Jurisdiction] (for injunctive relief)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">14. General Provisions</h2>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and MOTO3D AI</li>
              <li><strong>Severability:</strong> If any provision is unenforceable, the rest remains in effect</li>
              <li><strong>No Waiver:</strong> Failure to enforce any right does not waive that right</li>
              <li><strong>Assignment:</strong> You may not assign these Terms; we may assign to affiliates or successors</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays due to events beyond our control</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">15. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, contact us:
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
