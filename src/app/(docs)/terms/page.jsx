"use client";
import { useMemo, useState } from "react";
import Navbar1 from "@/components/navbar/Navbar1";
import RegionTabs from "./components/RegionTabs";
import QuickMenu from "./components/QuickMenu";
import Section from "./components/Section";
import { REGIONS, GENERAL_SECTIONS, CUSTOMER_SECTIONS, VENDOR_SECTIONS, renderSectionContent } from "./content";

// Responsive Terms of Service page inspired by the reference screenshot.
// - Left: Quick menu (sticky on desktop, collapsible on mobile)
// - Right: Content with audience tabs (General, Business/Vendors, Customers/Users)
// - Each quick menu item scrolls to its section

// Using content from ./content and components from ./components

export default function TermsOfServicePage() {
	const [region, setRegion] = useState("general");
	const [showQuickMenu, setShowQuickMenu] = useState(false);

	const lastUpdated = useMemo(() => new Date("2025-10-28").toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), []);

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
				<RegionTabs region={region} setRegion={setRegion} />

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Quick menu (mobile toggle) */}
					<div className="lg:col-span-3">
						<QuickMenu
						  items={region === "business" ? VENDOR_SECTIONS : region === "customers" ? CUSTOMER_SECTIONS : GENERAL_SECTIONS}
						  show={showQuickMenu}
						  onToggle={() => setShowQuickMenu((v) => !v)}
						  onJump={handleJump}
						/>
					</div>

					{/* Main content */}
					<div className="lg:col-span-9">
						{/* Intro */}
						<div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 mb-8">
							<p className="text-gray-700 leading-7">
								This document sets out the terms and conditions for your Synkkafrica personal account (your
								account) and its related services. It also sets out other important things that you need to
								know.
							</p>
							<p className="text-gray-700 leading-7 mt-4">
								These terms and conditions, along with the Privacy Policy and any other terms and conditions
								that apply to our services, form a legal agreement (the “Agreement”, or the “Terms”) between:
							</p>
							<ul className="list-decimal ml-6 mt-3 text-gray-700 leading-7">
								<li>You, the account holder, and</li>
								<li>Us, Synkkafrica Limited ("Synkkafrica").</li>
							</ul>
						</div>

						{/* Sections */}
						<div className="space-y-10">
							{(region === "business" ? VENDOR_SECTIONS : region === "customers" ? CUSTOMER_SECTIONS : GENERAL_SECTIONS).map((s) => (
								<Section key={s.id} id={s.id} title={s.title}>
									{renderSectionContent(region, s)}
								</Section>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

