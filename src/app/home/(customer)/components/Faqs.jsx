"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
	{
		id: 1,
		question: "How do I find booking deals on Synkkafrica?",
		answer:
			"Use our simplified search to scan deals from verified businesses. Apply filters on the results page to refine by price, rating, location, and availability.",
	},
	{
		id: 2,
		question: "What makes Synkkafrica a great booking app?",
		answer:
			"You’ll find the same great offers as the website plus mobile-only perks, faster checkouts, and notifications. The app is built for both discovery and repeat bookings.",
	},
	{
		id: 3,
		question: "How do I use Synkkafrica to manage my bookings?",
		answer:
			"Open the Bookings section from the menu to view upcoming and past bookings. You can modify details, reschedule, or cancel when allowed by the vendor’s policy.",
	},
	{
		id: 4,
		question: "How do I use Synkkafrica to manage my convenience services?",
		answer:
			"From the Services tab, you can schedule pickups, track progress, and manage payments for convenience offerings like laundry or car rentals—everything in one place.",
	},
];

function FaqItem({ item, open, onToggle }) {
	const contentRef = useRef(null);
	const [height, setHeight] = useState(0);

	// Measure content height whenever open changes or on resize
	useEffect(() => {
		const node = contentRef.current;
		if (!node) return;

		const measure = () => {
			setHeight(open ? node.scrollHeight : 0);
		};

		measure();

		// Keep height in sync if content wraps differently on viewport changes
		const ro =
			"ResizeObserver" in window
				? new ResizeObserver(measure)
				: null;

		if (ro) ro.observe(node);

		window.addEventListener("resize", measure);
		return () => {
			window.removeEventListener("resize", measure);
			if (ro) ro.disconnect();
		};
	}, [open]);

	return (
		<div className="rounded-xl border border-gray-100 bg-white shadow-sm">
			<button
				className="w-full flex items-start justify-between gap-4 text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl"
				aria-expanded={open}
				aria-controls={`faq-panel-${item.id}`}
				id={`faq-trigger-${item.id}`}
				onClick={onToggle}
			>
				<div className="flex items-start gap-3">
					<span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-100">
						<HelpCircle className="h-4 w-4" />
					</span>
					<span className="text-base sm:text-lg font-medium text-gray-900">
						{item.question}
					</span>
				</div>
				<span
					className={`shrink-0 mt-1 transition-transform duration-300 ${
						open ? "rotate-180" : ""
					}`}
					aria-hidden="true"
				>
					<ChevronDown className="h-5 w-5 text-gray-500" />
				</span>
			</button>

			<div
				id={`faq-panel-${item.id}`}
				role="region"
				aria-labelledby={`faq-trigger-${item.id}`}
				className={`px-4 sm:px-5 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
					open ? "opacity-100" : "opacity-0"
				}`}
				style={{ maxHeight: `${height}px` }}
			>
				<div
					ref={contentRef}
					className="pb-4 sm:pb-5 text-gray-700 text-sm sm:text-base leading-relaxed"
				>
					{item.answer}
				</div>
			</div>
		</div>
	);
}

export default function FaqSection() {
	// Multi-open behavior preserved; first item starts open
	const [openIds, setOpenIds] = useState(new Set([faqs[0].id]));

	const items = faqs;
	const isAllOpen = items.length > 0 && items.every((f) => openIds.has(f.id));

	const toggleOne = (id) =>
		setOpenIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const toggleAll = () =>
		setOpenIds((prev) => {
			const next = new Set(prev);
			if (isAllOpen) items.forEach((f) => next.delete(f.id));
			else items.forEach((f) => next.add(f.id));
			return next;
		});

	return (
		<section className="py-14 sm:py-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="max-w-3xl">
					<h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
						Frequently asked questions
					</h2>
					<p className="mt-2 text-gray-600">
						Answers to common questions about using Synkkafrica for discovery,
						bookings, and services.
					</p>
				</div>

				{/* Controls */}
				<div className="mt-6 flex items-center gap-3">
					<button
						type="button"
						onClick={toggleAll}
						className="inline-flex items-center rounded-xl bg-primary-600 text-white px-4 py-2 text-sm font-medium hover:bg-primary-500 active:bg-primary-700 transition-colors"
					>
						{isAllOpen ? "Collapse all" : "Expand all"}
					</button>
					<span className="text-sm text-gray-500">
						{items.length} item{items.length !== 1 ? "s" : ""}
					</span>
				</div>

				{/* List */}
				<div className="mt-6 grid grid-cols-1 gap-4">
					{items.map((item) => (
						<FaqItem
							key={item.id}
							item={item}
							open={openIds.has(item.id)}
							onToggle={() => toggleOne(item.id)}
						/>
					))}
				</div>

				{/* Footer help */}
				<div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
					<span className="text-gray-600">Still need help?</span>
					<a
						href="/support"
						className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-900 hover:border-primary-300 hover:text-primary-700 transition-colors"
					>
						Contact support
					</a>
				</div>
			</div>
		</section>
	);
}