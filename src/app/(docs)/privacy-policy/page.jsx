"use client";

import Navbar1 from "@/components/navbar/Navbar1";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar1 />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Effective Date: October 31, 2025</p>

        <div className="mt-8 space-y-6 text-gray-700 leading-7">
          <p>
            Welcome to SynKKAfrica. Your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform, website, or mobile app.
          </p>
          <p className="text-sm text-gray-600">
            The company is SynkkAfrica ("SynkkAfrica", "we", "us", "our").
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p className="mt-2">
              We collect the following types of data to deliver and improve our services:
            </p>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              <li><strong>Account Information:</strong> Name, email, phone number, and password when you create an account.</li>
              <li><strong>Booking Details:</strong> Dates, preferences, participants, and payment-related information.</li>
              <li><strong>Usage Data:</strong> Device type, IP address, browser type, and activity logs to improve functionality.</li>
              <li><strong>Communications:</strong> Messages, reviews, and feedback you share with vendors or SynKK Africa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <p className="mt-2">Your information helps us:</p>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              <li>Process bookings and payments securely.</li>
              <li>Connect you with verified vendors.</li>
              <li>Provide customer support and resolve disputes.</li>
              <li>Improve platform performance and personalize your experience.</li>
              <li>Send you important updates, offers, and service notices (you may opt out anytime).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Information Sharing</h2>
            <p className="mt-2">
              We only share your information when necessary to provide services:
            </p>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              <li><strong>With Vendors:</strong> To complete your confirmed bookings.</li>
              <li><strong>With Service Providers:</strong> Such as payment processors and technical support partners.</li>
              <li><strong>When Legally Required:</strong> To comply with laws, regulations, or court orders.</li>
            </ul>
            <p className="mt-2 font-medium">
              We never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Data Security</h2>
            <p className="mt-2">
              We use industry-standard encryption and security measures to protect your data. While we take all reasonable precautions, no platform is completely risk-free — please keep your login credentials private.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              <li>Access, correct, or delete your personal data.</li>
              <li>Withdraw consent for marketing communications.</li>
              <li>Request a copy of your stored data or ask for account deletion by contacting us at <a href="mailto:info@synkkafrica.com" className="text-blue-600 hover:underline">info@synkkafrica.com</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
            <p className="mt-2">
              We retain your information only as long as needed to fulfill bookings, comply with legal obligations, and maintain account records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Cookies and Tracking</h2>
            <p className="mt-2">
              We use cookies to enhance your browsing experience, remember preferences, and analyze platform usage. You can manage cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy to reflect new practices or legal requirements. If major changes occur, we'll notify you via email or in-app notice at least 14 days before they take effect.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
