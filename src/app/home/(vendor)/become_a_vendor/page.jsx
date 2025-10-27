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
			{/* Hero */}
			{/* <section className="relative overflow-hidden">
			<div className="absolute inset-0 -z-10 from-orange-50 to-white bg-linear-to-b" />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<div>
							<p className="uppercase tracking-wide text-xs text-orange-600 font-semibold">For African businesses</p>
							<h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-gray-900 mt-3">
								Become a vendor on Synkkafrica
							</h1>
							<p className="mt-4 text-gray-600 text-base sm:text-lg">
								Join a premium marketplace connecting travelers and locals with verified African services
								from hospitality and dining to experiences, logistics, and more.
							</p>
							<div className="mt-6 flex flex-wrap gap-3">
								<Link href="/dashboard/business/onboarding">
									<Button variant="filled" size="lg">Get started</Button>
								</Link>
								<Link href="/terms">
									<Button variant="outline" size="lg">View vendor terms</Button>
								</Link>
							</div>
							<p className="mt-3 text-xs text-gray-500">Free listing during launch. Quick verification. No code needed.</p>
						</div>
						<div className="relative h-56 sm:h-80 md:h-[420px]">
							<Image
								src="/images/brand/Synkkafrica-hero-vendors.png"
								alt="Synkkafrica Vendors"
								fill
								className="object-contain"
								priority
							/>
						</div>
					</div>
				</div>
			</section> */}

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

			{/* Final CTA */}
			<section className="py-12 sm:py-16">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Ready to grow with Synkkafrica?</h3>
					<p className="text-gray-600 mt-3">
						Join the platform built for outstanding African businesses. It takes just a few minutes to get
						started and go live.
					</p>
					<div className="mt-6 flex justify-center gap-3">
						<Link href="/dashboard/business/onboarding">
							<Button variant="filled" size="lg">Get started</Button>
						</Link>
						<Link href="/login">
							<Button variant="outline" size="lg">I already have an account</Button>
						</Link>
					</div>
				</div>
			</section>
				</main>
				<Footer />
			</>
		);
}

