"use client";

import Navbar1 from "@/components/navbar/Navbar1";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar1 />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: October 30, 2025</p>

        <div className="mt-8 space-y-6 text-gray-700 leading-7">
          <p>
            We value your privacy. This policy explains what data we collect, how we use it, and your
            rights. It applies to visitors, customers, and vendors using SynkkAfrica.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Information we collect</h2>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              <li>Account data (name, email, phone, business details).</li>
              <li>Usage and device data (logs, analytics, cookies).</li>
              <li>Booking and payment-related information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. How we use information</h2>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              <li>Provide, secure, and improve the platform.</li>
              <li>Process bookings and payments.</li>
              <li>Communicate updates and support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Sharing</h2>
            <p className="mt-2">
              We share data with service providers (e.g., payments, analytics) under strict agreements, or when
              required by law. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Your rights</h2>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              <li>Access, update, or delete your information.</li>
              <li>Opt out of certain communications.</li>
              <li>Contact us for data inquiries: <a href="mailto:cjegede@synkkafrica.com" className="text-blue-600 hover:underline">cjegede@synkkafrica.com</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Changes</h2>
            <p className="mt-2">We may update this policy. Material changes will be communicated via the site or email.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
