// Static data and render helpers for Terms page

export const REGIONS = [
  { key: "general", label: "General", emoji: "🌍" },
  { key: "business", label: "Business (Vendors)", emoji: "💼" },
  { key: "customers", label: "Customers (Users)", emoji: "👤" },
];

// General (merged) – neutral terms that apply to everyone
export const GENERAL_SECTIONS = [
  { id: "purpose", title: "1. Purpose and Scope" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "booking-payments", title: "3. Bookings and Payments" },
  { id: "cancellations", title: "4. Cancellations and Refunds" },
  { id: "responsibilities", title: "5. Responsibilities" },
  { id: "synkk-role", title: "6. Synkkafrica’s Role" },
  { id: "reviews", title: "7. Reviews and Feedback" },
  { id: "service-mods", title: "8. Service Modifications and Availability" },
  { id: "privacy", title: "9. Data and Privacy" },
  { id: "ip", title: "10. Intellectual Property" },
  { id: "liability", title: "11. Limitation of Liability" },
  { id: "termination", title: "12. Termination and Account Suspension" },
  { id: "modifications", title: "13. Modifications" },
  { id: "contact", title: "14. Contact" },
];

// Customers – detailed customer-facing ToS
export const CUSTOMER_SECTIONS = [
  { id: "purpose", title: "1. Purpose and Scope" },
  { id: "customer-eligibility", title: "2. Customer Eligibility" },
  { id: "booking-payments", title: "3. Booking and Payments" },
  { id: "cancellations", title: "4. Cancellations and Refunds" },
  { id: "customer-responsibilities", title: "5. Customer Responsibilities" },
  { id: "synkk-role", title: "6. Synkkafrica’s Role" },
  { id: "reviews", title: "7. Reviews and Feedback" },
  { id: "service-mods", title: "8. Service Modifications and Availability" },
  { id: "privacy", title: "9. Data and Privacy" },
  { id: "ip", title: "10. Intellectual Property" },
  { id: "liability", title: "11. Limitation of Liability" },
  { id: "termination", title: "12. Termination and Account Suspension" },
  { id: "modifications", title: "13. Modifications" },
  { id: "contact", title: "14. Contact" },
];

// Vendor specific sections (for Business tab)
export const VENDOR_SECTIONS = [
  { id: "purpose", title: "1. Purpose and Scope" },
  { id: "vendor-eligibility", title: "2. Vendor Eligibility" },
  { id: "vendor-responsibilities", title: "3. Vendor Responsibilities" },
  { id: "synkk-role", title: "4. Synkkafrica’s Role" },
  { id: "fees", title: "5. Fees and Commissions" },
  { id: "payments", title: "6. Payments" },
  { id: "cancellations", title: "7. Cancellations and Refunds" },
  { id: "quality", title: "8. Quality Assurance" },
  { id: "ip", title: "9. Intellectual Property" },
  { id: "privacy", title: "10. Data and Privacy" },
  { id: "termination", title: "11. Termination" },
  { id: "liability", title: "12. Limitation of Liability" },
  { id: "modifications", title: "13. Modifications" },
  { id: "contact", title: "14. Contact" },
];

// Render helpers return small JSX fragments; page.jsx is a client component so this works fine
export function renderSectionContent(region, s) {
  if (region === "customers") {
    switch (s.id) {
      case "purpose":
        return (
          <p>
            Synkkafrica connects you to authentic African businesses and services. By using the platform,
            you agree to these Terms.
          </p>
        );
      case "customer-eligibility":
        return (
          <ul className="list-disc ml-6 space-y-1">
            <li>Be at least 18 years old or legal age in your jurisdiction.</li>
            <li>Provide accurate, current, and complete information.</li>
            <li>Use the platform lawfully and follow SynKK community standards.</li>
          </ul>
        );
      case "booking-payments":
        return (
          <ul className="list-disc ml-6 space-y-1">
            <li>Book only via the official Synkkafrica platform.</li>
            <li>Payments are processed securely by our authorised gateway.</li>
            <li>You agree to pay totals due, including taxes and fees.</li>
          </ul>
        );
      case "cancellations":
        return (
          <>
            <p>Cancel according to the policy on each listing and SynKK’s general refund terms.</p>
            <p>
              If a vendor cancels a confirmed booking, we’ll help you with a full refund or a suitable
              alternative. Refunds typically process within 7–14 business days.
            </p>
          </>
        );
      case "customer-responsibilities":
        return (
          <ul className="list-disc ml-6 space-y-1">
            <li>Provide accurate booking details and contact information.</li>
            <li>Arrive on time and follow vendor rules.</li>
            <li>No misuse, fraud, or false reviews.</li>
            <li>Treat vendors and customers with respect. Breaches may lead to suspension.</li>
          </ul>
        );
      case "synkk-role":
        return (
          <p>
            We curate vendors, provide secure booking and payment tools, and offer customer support, but
            vendors remain responsible for delivery and quality of services.
          </p>
        );
      case "reviews":
        return <p>You may leave reviews; they must be honest, respectful, and relevant. We may moderate or remove inappropriate content.</p>;
      case "service-mods":
        return <p>We may improve or suspend features temporarily for maintenance or security.</p>;
      case "privacy":
        return <p>Your data is handled per our Privacy Policy. We share only what’s needed to complete bookings.</p>;
      case "ip":
        return <p>Platform content and technology belong to Synkkafrica. Use is limited to personal, non‑commercial purposes.</p>;
      case "liability":
        return (
          <ul className="list-disc ml-6 space-y-1">
            <li>We’re not liable for injuries, losses, or damages from vendor services or third parties.</li>
            <li>We’re not liable for indirect or consequential damages.</li>
            <li>Total liability is capped at the amount paid for the affected booking.</li>
          </ul>
        );
      case "termination":
        return (
          <ul className="list-disc ml-6 space-y-1">
            <li>We may suspend or terminate accounts for fraud, misuse, false information, chargebacks, or endangering others.</li>
            <li>You can close your account anytime from settings.</li>
          </ul>
        );
      case "modifications":
        return <p>We may update these Terms. Material changes will be announced via email or dashboard at least 14 days before effect.</p>;
      case "contact":
        return <p>Support and partnerships: cjegede@synkkafrica.com • www.synkkafrica.com</p>;
      default:
        return null;
    }
  }

  if (region === "general") {
    switch (s.id) {
      case "purpose":
        return (
          <p>
            Synkkafrica connects customers and verified African vendors. These General Terms summarise what
            applies to everyone using the platform, including booking, payments, privacy, and conduct.
          </p>
        );
      case "eligibility":
        return <p>Users must be of legal age and provide accurate information. Use must comply with local laws and SynKK policies.</p>;
      case "booking-payments":
        return <p>Bookings and payments are processed securely on Synkkafrica via authorised payment partners. Taxes and fees may apply.</p>;
      case "cancellations":
        return <p>Cancellations and refunds follow each listing’s policy and SynKK’s general refund rules. Vendor cancellations grant a full refund or alternative.</p>;
      case "responsibilities":
        return <p>All users should provide accurate details, respect policies, and avoid misuse or fraud. Breaches may lead to suspension.</p>;
      case "synkk-role":
        return <p>Synkkafrica facilitates discovery, bookings and payments but does not own or operate vendor services.</p>;
      case "reviews":
        return <p>Reviews must be honest and respectful. We may moderate or remove misleading or abusive content.</p>;
      case "service-mods":
        return <p>We may update features or perform maintenance. Temporary interruptions may occur.</p>;
      case "privacy":
        return <p>We handle data per our Privacy Policy and share only what’s necessary to complete bookings.</p>;
      case "ip":
        return <p>All platform content and technology are Synkkafrica’s property; use is limited to personal, lawful purposes.</p>;
      case "liability":
        return <p>Synkkafrica isn’t liable for vendor operations or indirect damages. Liability is capped at the amount paid for the affected booking.</p>;
      case "termination":
        return <p>Accounts may be suspended for fraud, misuse, or policy breaches. Users can close accounts via settings.</p>;
      case "modifications":
        return <p>We may update these Terms and will notify users of material changes in advance.</p>;
      case "contact":
        return <p>Contact: cjegede@synkkafrica.com • www.synkkafrica.com</p>;
      default:
        return null;
    }
  }

  // business/vendor content
  switch (s.id) {
    case "purpose":
      return (
        <>
          <p>
            Synkkafrica is a premium digital ecosystem connecting travelers and locals to verified African
            businesses — including restaurants, transportation services, cultural tour operators, hospitality
            providers, and premium experience curators.
          </p>
          <p>These Terms govern how vendors list, operate, and earn from the platform.</p>
        </>
      );
    case "vendor-eligibility":
      return (
        <ul className="list-disc ml-6 space-y-1">
          <li>Be a registered business or individual operating legally within your region.</li>
          <li>Provide accurate business and contact information.</li>
          <li>Undergo SynKK’s verification process (as outlined in the Vendor Onboarding Form).</li>
          <li>Uphold SynKK’s standards of quality, safety, and reliability.</li>
        </ul>
      );
    case "vendor-responsibilities":
      return (
        <ul className="list-disc ml-6 space-y-1">
          <li>Maintain accurate and updated service details, pricing, and availability.</li>
          <li>Deliver services as described and on schedule.</li>
          <li>Provide excellent customer service aligned with SynKK’s premium values.</li>
          <li>Comply with all applicable laws and regulations.</li>
          <li>Do not misuse or manipulate the platform, its ratings, or data.</li>
        </ul>
      );
    case "synkk-role":
      return (
        <>
          <p>Synkkafrica acts as a connecting and booking platform. We:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Curate and feature vendors based on verified quality.</li>
            <li>Facilitate bookings and secure payments between users and vendors.</li>
            <li>Promote vendors through marketing and partnerships.</li>
            <li>May remove or suspend vendors who fail to meet standards.</li>
          </ul>
          <p className="mt-3">
            Synkkafrica does not own, operate, or directly provide the vendor’s services but serves as the bridge
            between vendors and customers.
          </p>
        </>
      );
    case "fees":
      return (
        <>
          <p className="font-semibold">Launch Offer (December 2025):</p>
          <p className="mb-2">All verified vendors will enjoy free listing and zero commission fees for the launch month of December 2025.</p>
          <p className="font-semibold">Starting January 2026:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Synkkafrica will introduce a service charge or commission per transaction (exact rate to be communicated before implementation).</li>
            <li>This fee enables continued marketing, technology improvements, customer support, and payment processing.</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">Vendors will be notified at least 14 days in advance of any updates to service fees or commissions.</p>
        </>
      );
    case "payments":
      return (
        <ul className="list-disc ml-6 space-y-1">
          <li>Payments from customers are processed through Synkkafrica’s secure platform.</li>
          <li>Vendors receive payouts (less applicable commissions) within the stated payment cycle after completion of services.</li>
          <li>Vendors must provide accurate bank or payment details for successful settlements.</li>
        </ul>
      );
    case "cancellations":
      return (
        <ul className="list-disc ml-6 space-y-1">
          <li>Vendors must honor confirmed bookings.</li>
          <li>Any vendor-initiated cancellation should be communicated promptly via the dashboard or customer support.</li>
          <li>Refunds are managed according to Synkkafrica’s refund policy and may impact vendor ratings.</li>
        </ul>
      );
    case "quality":
      return (
        <>
          <p>Synkkafrica reserves the right to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Conduct quality checks and collect customer feedback.</li>
            <li>Suspend or delist vendors who receive consistent negative reviews or fail to meet performance standards.</li>
          </ul>
        </>
      );
    case "ip":
      return (
        <p>
          All content, technology, and brand materials on the Synkkafrica platform remain the property of Synkkafrica.
          Vendors may use SynKK branding only in accordance with official guidelines and with prior permission.
        </p>
      );
    case "privacy":
      return <p>Synkkafrica will process vendor and customer data in line with our Privacy Policy. Vendors must also maintain confidentiality of customer information obtained through the platform.</p>;
    case "termination":
      return (
        <>
          <p>Synkkafrica may suspend or remove vendors immediately for:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Fraudulent or illegal activity</li>
            <li>Repeated service failures</li>
            <li>Misrepresentation</li>
            <li>Breach of these Terms</li>
          </ul>
        </>
      );
    case "liability":
      return <p>Synkkafrica shall not be liable for indirect, incidental, or consequential damages arising from vendor operations or customer interactions.</p>;
    case "modifications":
      return <p>Synkkafrica reserves the right to update these Terms. Vendors will be notified of material changes via email or dashboard notification.</p>;
    case "contact":
      return (
        <ul className="list-none ml-0">
          <li>For inquiries, support, or partnership questions:</li>
          <li className="mt-1">📩 <a href="mailto:cjegede@synkkafrica.com" className="text-blue-600 hover:underline">cjegede@synkkafrica.com</a></li>
          <li>🌍 <a href="https://www.synkkafrica.com" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">www.synkkafrica.com</a></li>
        </ul>
      );
    default:
      return null;
  }
}
