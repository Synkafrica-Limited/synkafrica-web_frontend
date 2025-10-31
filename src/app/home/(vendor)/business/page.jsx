"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Buttons";
import VendorSimpleNavbar from "@/components/navbar/VendorSimpleNavbar";
import Footer from "@/components/footer/Footer";
import { useEffect, useRef, useState } from "react";

// Become a Vendor (Get started) – responsive landing built to match brand aesthetics
export default function BecomeVendorPage() {
  // Partners slider (mobile)
  const partnersRef = useRef(null);
  const partners = ["Boat Naija", "Living Lagos", "Gladiator.ng", "Villamonumentvi", "SLUSH"];

  // Autoplay (mobile only)
  const autoplayRef = useRef(null);
  const isPausedRef = useRef(false);
  const pauseAutoplay = () => { isPausedRef.current = true; };
  const resumeAutoplay = () => { isPausedRef.current = false; };

  const startAutoplay = () => {
    if (autoplayRef.current) return;
    autoplayRef.current = setInterval(() => {
      const el = partnersRef.current;
      if (!el || isPausedRef.current) return;
      const step = Math.round(el.clientWidth * 0.8);
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "auto" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

    useEffect(() => {
        // Enable autoplay only on small screens
        const mql = window.matchMedia("(min-width: 640px)");
        const handleChange = () => {
            if (mql.matches) stopAutoplay();
            else startAutoplay();
        };
        handleChange();
        if (mql.addEventListener) mql.addEventListener("change", handleChange);
        else mql.addListener(handleChange);

        return () => {
            if (mql.removeEventListener) mql.removeEventListener("change", handleChange);
            else mql.removeListener(handleChange);
            stopAutoplay();
        };
    }, []);

	return (
		<>
			<VendorSimpleNavbar />
			<main className="min-h-screen bg-white">
			

			   {/* Preview Section */}
            <section className="py-12 sm:py-16 border-gray-100">
            				<div className=" max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 text-center">
					<h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
						Powerful tools to grow your business
					</h1>
					<p className="mt-4 text-base sm:text-xl text-gray-600">
						Manage your services, availability, and pricing all in one place with our intuitive vendor dashboard.
					</p>
					<div className="space-y-5 mt-8 flex justify-center">
						<Link href="/business/signup">
							<Button size="lg" className="rounded-full px-8">
								Get started <span className="ml-2">→</span>
							</Button>
						</Link>
					</div>
				</div>

                <div className="relative z-0 mt-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
					<div className="mx-auto w-full p-3">
						<div className=" overflow-hidden bg-white">
							<Image
								src="/images/vendor/vendor_dashboard.png"
								alt="Synkkafrica dashboard preview"
								width={1500}
								height={800}
								className="w-full h-auto"
								priority
							/>
						</div>
					</div>
				</div>
			</section>

                    {/* Partners (As featured in) */}
            <section className="relative z-10 -mt-16 sm:-mt-24 pt-16 sm:pt-24 pb-12 sm:pb-16 bg-gray-50">
                <div className="max-w-7xl h-[px] mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Some of Our Partners
                    </p>

                    {/* Mobile: slider with autoplay */}
                    <div className="relative mt-6 sm:hidden">
                      <div
                        ref={partnersRef}
                        className="no-scrollbar -mx-1 px-1 flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth"
                        aria-label="Synkkafrica partners slider"
                        onMouseEnter={pauseAutoplay}
                        onMouseLeave={resumeAutoplay}
                        onTouchStart={pauseAutoplay}
                        onTouchEnd={resumeAutoplay}
                      >
                        {partners.map((name) => (
                          <div
                            key={name}
                            className="snap-start shrink-0 min-w-44 px-4 py-3 rounded-2xl bg-white text-center text-lg font-black tracking-wider text-primary-800/80 border border-gray-100 shadow-sm"
                          >
                            {name}
                          </div>
                        ))}
                      </div>

                                        {/* Nav buttons removed for a cleaner mobile auto-scroll experience */}
                    </div>

                    {/* Desktop: 5-column grid */}
                    <div className="mt-8 hidden sm:grid sm:grid-cols-5 sm:gap-10">
                        {partners.map((name, idx) => (
                            <div
                                key={name}
                                className={`text-xl font-black tracking-wider text-center opacity-80 ${idx >= 3 ? "hidden sm:block" : ""}`}
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

			{/* Vendor overview section (replaces old hero) */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center rounded-3xl border border-gray-100 bg-white p-5 sm:p-10 shadow-sm">
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
                                <Link href="/business/signup">
                                    <Button variant="filled" size="md">Get started</Button>
                                </Link>
                                <Link href="/terms">
                                    <Button variant="outline" size="md">View Terms</Button>
                                </Link>
                            </div>
                        </div>
                        {/* Make preview image keep a good aspect on small screens */}
                        <div className="relative w-full aspect-16/10 sm:aspect-video">
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



            {/* Use cases */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-gray-900">
                        Tools built for every type of vendor
                    </h2>
                    <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {[
                            { title: "Listings", desc: "Showcase your services and attract customers.", tone: "from-primary-900 to-primary-500", icon: "💳" },
                            { title: "Payouts", desc: "Get paid for bookings delivered on with nice rates", tone: "from-primary-600 to-primary-500", icon: "💸" },
                            { title: "Reach", desc: "Expand your customer base and increase sales with our platform.", tone: "from-primary-400 to-primary-300", icon: "💱" },
                            { title: "Bookings", desc: "Manage and track your bookings effortlessly.", tone: "from-primary-900 to-primary-800", icon: "👜" },
                        ].map((c, idx) => (
                            <div key={idx} className={`rounded-3xl p-5 sm:p-8 text-white shadow-lg bg-linear-to-br ${c.tone}`}>
                                <div className="text-2xl sm:text-3xl">{c.icon}</div>
                                <h3 className="mt-3 text-xl sm:text-2xl font-semibold">{c.title}</h3>
                                <p className="mt-2 text-sm sm:text-base opacity-90">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-12 sm:py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why list with Synkkafrica?</h2>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { title: "Reach more customers", desc: "Tap into local and international demand with built-in discovery.", icon: "🌍" },
                            { title: "Fast, secure payouts", desc: "Streamlined checkout and predictable settlement cycles.", icon: "💳" },
                            { title: "Smart tools", desc: "Dashboards, reviews, pricing, and scheduling that just work.", icon: "🧰" },
                            { title: "Vetted quality", desc: "We spotlight the best providers with premium positioning.", icon: "🏅" },
                        ].map((b) => (
                            <div key={b.title} className="rounded-2xl border border-gray-100 p-4 sm:p-6 bg-white shadow-sm">
                                <div className="text-2xl">{b.icon}</div>
                                <div className="mt-3 font-semibold text-gray-900">{b.title}</div>
                                <p className="text-gray-600 text-sm mt-1">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-12 sm:py-16 bg-primary-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900">How it works</h2>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { step: 1, title: "Create account", desc: "Tell us about your business and contact details." },
                            { step: 2, title: "Add details", desc: "Services, pricing, images, availability, and payout info." },
                            { step: 3, title: "Verification", desc: "Quick review to keep quality high and customers safe." },
                            { step: 4, title: "Go live", desc: "Start receiving bookings and manage everything in your dashboard." },
                        ].map((s) => (
                            <div key={s.step} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
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
                    <div className="rounded-3xl bg-linear-to-r from-primary-500 to-primary-200 text-white p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6 shadow-xl text-center sm:text-left">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-bold">Explore SynkkAfrica</h3>
                            <p className="mt-2 text-white/90">Create an account instantly and start accepting bookings and payments.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/business/signup">
                                <Button variant="outline" size="lg" className="rounded-full border-white text-white hover:bg-primary-200 hover:text-secondary-700">Get started →</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="filled" size="md" className="rounded-full text-secondary-700 hover:bg-primary-200/90">Log in</Button>
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

