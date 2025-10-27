"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Buttons";
import VendorSimpleNavbar from "@/components/navbar/VendorSimpleNavbar";
import Footer from "@/components/footer/Footer";

// Become a Vendor (Get started) – responsive landing built to match brand aesthetics
export default function BecomeVendorPage() {
	return (
		<>
			<VendorSimpleNavbar />
			<main className="min-h-screen bg-white">
			

			   {/* Preview Section */}
            <section className="py-12 sm:py-16 border-gray-100">
            				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 text-center">
					<h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
						Powerful tools to grow your business
					</h1>
					<p className="mt-4 text-base sm:text-xl text-gray-600">
						Manage your services, availability, and pricing all in one place with our intuitive vendor dashboard.
					</p>
					<div className="mt-8 flex justify-center">
						<Link href="/dashboard/business/onboarding">
							<Button size="lg" className="rounded-full px-8">
								Get started <span className="ml-2">→</span>
							</Button>
						</Link>
					</div>
				</div>

				<div className="relative mt-12 sm:mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
					<div className="mx-auto w-full rounded-4xl bg-black p-3 shadow-2xl">
						<div className="rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white">
							<Image
								src="/images/vendor/services.png"
								alt="Synkkafrica dashboard preview"
								width={2400}
								height={1400}
								className="w-full h-auto"
								priority
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Partners (As featured in) */}
			<section className="py-20 sm:py-12 bg-gray-50">
				<div className="max-w-7xl mx-auto max-h-3xl px-4 sm:px-6 lg:px-8">
					<p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Some of Our Partners </p>
					<div className="mt-6 grid grid-cols-3 sm:grid-cols-5 items-center gap-6 sm:gap-10 text-primary-800">
						<div className="text-2xl font-black tracking-wider text-center opacity-80">Boat Naija</div>
						<div className="text-2xl font-black tracking-wider text-center opacity-80">Living Lagos</div>
						<div className="text-2xl font-black tracking-wider text-center col-span-1 sm:col-span-1 opacity-80">Gladiator.ng</div>
						<div className="hidden sm:block text-2xl font-black tracking-wider text-center opacity-80">Villamonumentvi</div>
						<div className="hidden sm:block text-2xl font-black tracking-wider text-center opacity-80">SLUSH</div>
					</div>
				</div>
			</section>

			{/* Use cases */}
			<section className="py-12 sm:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-900">
						Tools built for every type of vendor
					</h2>
					<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
						{[
							{ title: "Listings", desc: "Showcase your services and attract customers.", tone: "from-primary-900 to-primary-500", icon: "💳" },
							{ title: "Payouts", desc: "Get paid for bookings delivered on with nice rates", tone: "from-primary-600 to-primary-500", icon: "💸" },
							{ title: "Reach", desc: "Expand your customer base and increase sales with our platform.", tone: "from-primary-400 to-primary-300", icon: "💱" },
							{ title: "Bookings", desc: "Manage and track your bookings effortlessly.", tone: "from-primary-900 to-primary-800", icon: "👜" },
						].map((c, idx) => (
							<div key={idx} className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg bg-linear-to-br ${c.tone}`}>
								<div className="text-3xl">{c.icon}</div>
								<h3 className="mt-3 text-2xl font-semibold">{c.title}</h3>
								<p className="mt-2 text-sm/6 opacity-90">{c.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Vendor overview section (replaces old hero) */}
			<section className="py-12 sm:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
						<div>
							<p className="uppercase tracking-wide text-xs text-primary-600 font-semibold">For African businesses</p>
							<h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 mt-2">
								Built for vendors, optimized for growth
							</h2>
							<p className="mt-3 text-gray-600 text-base">
								Showcase services, manage bookings, and get paid quickly—all in one premium marketplace designed for African providers.
							</p>
							<ul className="mt-6 space-y-4">
								{[
									{ title: "Verified exposure", desc: "Be discovered by travelers and locals across the continent." },
									{ title: "Fast payouts", desc: "Reliable settlement cycles and clear earnings." },
									{ title: "Booking management", desc: "Simple tools for availability, pricing, and reviews." },
									{ title: "Dedicated support", desc: "We help you onboard and scale smoothly." },
								].map((f) => (
									<li key={f.title} className="flex items-start gap-3">
										<span className="mt-1 w-6 h-6 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center text-sm">✓</span>
										<div>
											<p className="font-semibold text-gray-900">{f.title}</p>
											<p className="text-gray-600 text-sm">{f.desc}</p>
										</div>
									</li>
								))}
							</ul>

							<div className="mt-6 flex flex-wrap gap-3">
								<Link href="/dashboard/business/onboarding">
									<Button variant="filled" size="md">Get started</Button>
								</Link>
								<Link href="/terms">
									<Button variant="outline" size="md">View Terms</Button>
								</Link>
							</div>
						</div>
						<div className="relative h-56 sm:h-80 md:h-[360px]">
							<Image
								src="/images/vendor/services.png"
								alt="Synkkafrica vendor dashboard"
								fill
								className="object-contain"
								priority
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section className="py-12 sm:py-16 border-t border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why list with Synkkafrica?</h2>
					<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{ title: "Reach more customers", desc: "Tap into local and international demand with built-in discovery.", icon: "🌍" },
							{ title: "Fast, secure payouts", desc: "Streamlined checkout and predictable settlement cycles.", icon: "💳" },
							{ title: "Smart tools", desc: "Dashboards, reviews, pricing, and scheduling that just work.", icon: "🧰" },
							{ title: "Vetted quality", desc: "We spotlight the best providers with premium positioning.", icon: "🏅" },
						].map((b) => (
							<div key={b.title} className="rounded-2xl border border-gray-100 p-5 sm:p-6 bg-white shadow-sm">
								<div className="text-2xl">{b.icon}</div>
								<div className="mt-3 font-semibold text-gray-900">{b.title}</div>
								<p className="text-gray-600 text-sm mt-1">{b.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

         

			{/* How it works */}
			<section className="py-12 sm:py-16 bg-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How it works</h2>
					<div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
						{[
							{ step: 1, title: "Create account", desc: "Tell us about your business and contact details." },
							{ step: 2, title: "Add details", desc: "Services, pricing, images, availability, and payout info." },
							{ step: 3, title: "Verification", desc: "Quick review to keep quality high and customers safe." },
							{ step: 4, title: "Go live", desc: "Start receiving bookings and manage everything in your dashboard." },
						].map((s) => (
							<div key={s.step} className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
								<div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
									{s.step}
								</div>
								<div className="mt-3 font-semibold text-gray-900">{s.title}</div>
								<p className="text-gray-600 text-sm mt-1">{s.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Requirements */}
			<section className="py-12 sm:py-16 border-t border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What you’ll need</h2>
					<ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
						{[
							"Registered business or lawful individual operator",
							"Valid contact details",
							"Service description and pricing",
							"Quality images (up to 10 slides)",
							"Payout account details",
							"Willingness to uphold Synkkafrica’s premium standards",
						].map((t) => (
							<li key={t} className="flex items-start gap-2">
								<span className="mt-0.5 text-green-600">✔</span>
								<span>{t}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Final CTA – gradient banner */}
			<section className="py-10 sm:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="rounded-3xl h-48 bg-linear-to-r from-primary-500 to-primary-200 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
						<div>
							<h3 className="text-2xl sm:text-3xl font-bold">Explore SynkAfrica</h3>
							<p className="mt-2 text-white/90">Create an account instantly and start accepting bookings and payments.</p>
						</div>
						<div className="flex items-center gap-3">
							<Link href="/dashboard/business/onboarding">
								<Button variant="outline" size="lg" className="rounded-full border-white text-white hover:bg-primary-200 hover:text-secondary-700">Get started →</Button>
							</Link>
							<Link href="/login">
								<Button variant="filled" size="md" className="rounded-full text-secondary-700 hover:bg-white/90">Log in</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
				</main>
				<Footer />
			</>
		);
}

