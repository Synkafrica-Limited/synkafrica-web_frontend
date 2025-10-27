"use client";
import { useMemo, useState } from "react";
import Navbar1 from "@/components/navbar/Navbar1";

// Responsive Terms of Service page inspired by the reference screenshot.
// - Left: Quick menu (sticky on desktop, collapsible on mobile)
// - Right: Content with audience tabs (General, Business/Vendors, Customers/Users)
// - Each quick menu item scrolls to its section

const REGIONS = [
	{ key: "general", label: "General", emoji: "🌍" },
	{ key: "business", label: "Business (Vendors)", emoji: "💼" },
	{ key: "customers", label: "Customers (Users)", emoji: "👤" },
];

const SECTIONS = [
	{ id: "service", title: "1. The service" },
	{ id: "using", title: "2. Using the service" },
	{ id: "eligibility", title: "3. Eligibility of service" },
	{ id: "paying", title: "4. Paying for the service" },
	{ id: "receiving", title: "5. Receiving a remittance" },
	{ id: "restrictions", title: "6. Important service restrictions" },
	{ id: "personal", title: "7. How and why we collect personal information" },
	{ id: "cancellation", title: "8. Error resolution, cancellation and refunds" },
	{ id: "duration", title: "9. Duration and timeframe for Payments" },
	{ id: "unauthorized", title: "11. Unauthorised Transactions/Payments" },
	{ id: "restricting", title: "12. Restricting your Account" },
];

// Vendor specific sections (for Business tab)
const VENDOR_SECTIONS = [
	{ id: "purpose", title: "1. Purpose and Scope" },
	{ id: "vendor-eligibility", title: "2. Vendor Eligibility" },
	{ id: "vendor-responsibilities", title: "3. Vendor Responsibilities" },
	{ id: "synkk-role", title: "4. SynKK Africa’s Role" },
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

function Section({ id, title, children }) {
	return (
		<section id={id} className="scroll-mt-28 justify-between">
			<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{title}</h3>
			<div className="text-gray-700 leading-7 space-y-4 text-sm sm:text-base">{children}</div>
		</section>
	);
}

export default function TermsOfServicePage() {
	const [region, setRegion] = useState("general");
	const [showQuickMenu, setShowQuickMenu] = useState(false);

	const lastUpdated = useMemo(() => new Date("2024-09-02").toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), []);

	const handleJump = (id) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
		setShowQuickMenu(false);
	};

	return (
			<div className="min-h-screen bg-white">
				<Navbar1 />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
				{/* Title row */}
				<div className="mb-6 sm:mb-8 justify-center">
					<h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Terms of service</h1>
					<p className="text-gray-500 mt-2 text-sm">Last updated on: {lastUpdated}</p>
				</div>

				{/* Region tabs */}
				<div className="flex flex-wrap gap-3 mb-8">
					{REGIONS.map((r) => (
						<button
							key={r.key}
							type="button"
							onClick={() => setRegion(r.key)}
							className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
								region === r.key
									? "border-orange-500 bg-orange-50 text-orange-700"
									: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
							}`}
						>
							<span className="text-base">{r.emoji}</span>
							{r.label}
						</button>
					))}
				</div>

								<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Quick menu (mobile toggle) */}
					<div className="lg:col-span-3">
						<div className="lg:hidden mb-2">
							<button
								type="button"
								onClick={() => setShowQuickMenu((v) => !v)}
								className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left font-medium text-gray-800"
							>
								Quick menu
							</button>
						</div>

												<nav
														className={`${showQuickMenu ? "block" : "hidden"} lg:block lg:sticky lg:top-24 rounded-2xl border border-gray-100 bg-white`}
												>
							<div className="px-4 py-4 text-sm font-semibold text-gray-800">Quick menu</div>
													<ul className="divide-y divide-gray-100">
																{(region === "business" ? VENDOR_SECTIONS : SECTIONS).map((s) => (
									<li key={s.id}>
										<button
											type="button"
											onClick={() => handleJump(s.id)}
											className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
										>
											{s.title}
										</button>
									</li>
								))}
							</ul>
						</nav>
					</div>

					{/* Main content */}
					<div className="lg:col-span-9">
						{/* Intro */}
						<div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 mb-8">
							<p className="text-gray-700 leading-7">
								This document sets out the terms and conditions for your Synkafrica personal account (your
								account) and its related services. It also sets out other important things that you need to
								know.
							</p>
							<p className="text-gray-700 leading-7 mt-4">
								These terms and conditions, along with the Privacy Policy and any other terms and conditions
								that apply to our services, form a legal agreement (the “Agreement”, or the “Terms”) between:
							</p>
							<ul className="list-decimal ml-6 mt-3 text-gray-700 leading-7">
								<li>You, the account holder, and</li>
								<li>Us, Synkafrica Limited ("Synkafrica").</li>
							</ul>
						</div>

												{/* Sections */}
												<div className="space-y-10">
													{(region === "business" ? VENDOR_SECTIONS : SECTIONS).map((s) => (
														<Section key={s.id} id={s.id} title={s.title}>
															{region === "general" && (
																<>
																	<p>
																		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et erat non lacus
																		pulvinar venenatis. Aliquam vitae risus nec sem fermentum posuere. Nulla facilisi.
																	</p>
																	<p>
																		By using the Services, you agree to these General Terms and any policies referenced within
																		them. We may update these Terms occasionally and will notify you of significant changes.
																	</p>
																</>
															)}

															{region === "customers" && (
																<>
																	<p>
																		Audience-specific terms for customers and end users. Some obligations and rights may
																		differ compared to business accounts. In case of conflict with the General Terms, the
																		customer terms apply.
																	</p>
																</>
															)}

															{region === "business" && (
																<>
																	{s.id === "purpose" && (
																		<>
																			<p>
																				SynKK Africa is a premium digital ecosystem connecting travelers and locals to
																				verified African businesses — including restaurants, transportation services,
																				cultural tour operators, hospitality providers, and premium experience curators.
																			</p>
																			<p>
																				These Terms govern how vendors list, operate, and earn from the platform.
																			</p>
																		</>
																	)}
																	{s.id === "vendor-eligibility" && (
																		<ul className="list-disc ml-6 space-y-1">
																			<li>Be a registered business or individual operating legally within your region.</li>
																			<li>Provide accurate business and contact information.</li>
																			<li>Undergo SynKK’s verification process (as outlined in the Vendor Onboarding Form).</li>
																			<li>Uphold SynKK’s standards of quality, safety, and reliability.</li>
																		</ul>
																	)}
																	{s.id === "vendor-responsibilities" && (
																		<ul className="list-disc ml-6 space-y-1">
																			<li>Maintain accurate and updated service details, pricing, and availability.</li>
																			<li>Deliver services as described and on schedule.</li>
																			<li>Provide excellent customer service aligned with SynKK’s premium values.</li>
																			<li>Comply with all applicable laws and regulations.</li>
																			<li>Do not misuse or manipulate the platform, its ratings, or data.</li>
																		</ul>
																	)}
																	{s.id === "synkk-role" && (
																		<>
																			<p>SynKK Africa acts as a connecting and booking platform. We:</p>
																			<ul className="list-disc ml-6 space-y-1">
																				<li>Curate and feature vendors based on verified quality.</li>
																				<li>Facilitate bookings and secure payments between users and vendors.</li>
																				<li>Promote vendors through marketing and partnerships.</li>
																				<li>May remove or suspend vendors who fail to meet standards.</li>
																			</ul>
																			<p className="mt-3">
																				SynKK Africa does not own, operate, or directly provide the vendor’s services but serves as the bridge
																				between vendors and customers.
																			</p>
																		</>
																	)}
																	{s.id === "fees" && (
																		<>
																			<p className="font-semibold">Launch Offer (December 2025):</p>
																			<p className="mb-2">All verified vendors will enjoy free listing and zero commission fees for the launch month of December 2025.</p>
																			<p className="font-semibold">Starting January 2026:</p>
																			<ul className="list-disc ml-6 space-y-1">
																				<li>SynKK Africa will introduce a service charge or commission per transaction (exact rate to be communicated before implementation).</li>
																				<li>This fee enables continued marketing, technology improvements, customer support, and payment processing.</li>
																			</ul>
																			<p className="mt-2 text-sm text-gray-600">Vendors will be notified at least 14 days in advance of any updates to service fees or commissions.</p>
																		</>
																	)}
																	{s.id === "payments" && (
																		<ul className="list-disc ml-6 space-y-1">
																			<li>Payments from customers are processed through SynKK Africa’s secure platform.</li>
																			<li>Vendors receive payouts (less applicable commissions) within the stated payment cycle after completion of services.</li>
																			<li>Vendors must provide accurate bank or payment details for successful settlements.</li>
																		</ul>
																	)}
																	{s.id === "cancellations" && (
																		<ul className="list-disc ml-6 space-y-1">
																			<li>Vendors must honor confirmed bookings.</li>
																			<li>Any vendor-initiated cancellation should be communicated promptly via the dashboard or customer support.</li>
																			<li>Refunds are managed according to SynKK Africa’s refund policy and may impact vendor ratings.</li>
																		</ul>
																	)}
																	{s.id === "quality" && (
																		<>
																			<p>SynKK Africa reserves the right to:</p>
																			<ul className="list-disc ml-6 space-y-1">
																				<li>Conduct quality checks and collect customer feedback.</li>
																				<li>Suspend or delist vendors who receive consistent negative reviews or fail to meet performance standards.</li>
																			</ul>
																		</>
																	)}
																	{s.id === "ip" && (
																		<p>
																			All content, technology, and brand materials on the SynKK Africa platform remain the property of SynKK Africa.
																			Vendors may use SynKK branding only in accordance with official guidelines and with prior permission.
																		</p>
																	)}
																	{s.id === "privacy" && (
																		<p>
																			SynKK Africa will process vendor and customer data in line with our Privacy Policy. Vendors must also
																			maintain confidentiality of customer information obtained through the platform.
																		</p>
																	)}
																	{s.id === "termination" && (
																		<>
																			<p>SynKK Africa may suspend or remove vendors immediately for:</p>
																			<ul className="list-disc ml-6 space-y-1">
																				<li>Fraudulent or illegal activity</li>
																				<li>Repeated service failures</li>
																				<li>Misrepresentation</li>
																				<li>Breach of these Terms</li>
																			</ul>
																		</>
																	)}
																	{s.id === "liability" && (
																		<p>
																			SynKK Africa shall not be liable for indirect, incidental, or consequential damages arising from vendor
																			operations or customer interactions.
																		</p>
																	)}
																	{s.id === "modifications" && (
																		<p>
																			SynKK Africa reserves the right to update these Terms. Vendors will be notified of material changes via
																			email or dashboard notification.
																		</p>
																	)}
																	{s.id === "contact" && (
																		<ul className="list-none ml-0">
																			<li>For inquiries, support, or partnership questions:</li>
																			<li className="mt-1">📩 <a href="mailto:cjegede@synkkafrica.com" className="text-blue-600 hover:underline">cjegede@synkkafrica.com</a></li>
																			<li>🌍 <a href="https://www.synkkafrica.com" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">www.synkkafrica.com</a></li>
																		</ul>
																	)}
																</>
															)}
														</Section>
													))}
												</div>
					</div>
				</div>
			</div>
		</div>
	);
}

