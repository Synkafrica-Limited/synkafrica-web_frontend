"use client";
import { useMemo, useState } from "react";

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

function Section({ id, title, children }) {
	return (
		<section id={id} className="scroll-mt-28">
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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
				{/* Title row */}
				<div className="mb-6 sm:mb-8">
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
								{SECTIONS.map((s) => (
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
							{SECTIONS.map((s) => (
								<Section key={s.id} id={s.id} title={s.title}>
									{region === "general" ? (
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
									) : (
										<>
											<p>
												Audience-specific terms for <span className="font-medium capitalize">{region}</span>.
												Certain provisions, limits, or obligations may differ for businesses
												and end users. Where these audience terms conflict with the General
												Terms, the audience terms apply.
											</p>
											<p>
												Please review the full audience terms applicable to your account type
												for the most accurate information.
											</p>
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

