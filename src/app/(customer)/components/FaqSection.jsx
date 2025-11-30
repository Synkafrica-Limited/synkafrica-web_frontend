"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQComponent() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I find booking deals on Synkkafrica?",
      answer:
        "Use our simplified search to scan deals from verified businesses. Apply filters on the results page to refine by price, rating, location, and availability.",
    },
    {
      question: "What makes Synkkafrica a great booking app?",
      answer:
        "You’ll find the same great offers as the website plus mobile-only perks, faster checkouts, and notifications. The app is built for both discovery and repeat bookings.",
    },
    {
      question: "How do I use Synkkafrica to manage my bookings?",
      answer:
        "Open the Bookings section from the menu to view upcoming and past bookings. You can modify details, reschedule, or cancel when allowed by the vendor’s policy.",
    },
    {
      question: "How do I use Synkkafrica to manage my convenience services?",
      answer:
        "From the Services tab, you can schedule pickups, track progress, and manage payments for convenience offerings like laundry or car rentals—everything in one place.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600">
              Answers to common questions about using Synkkafrica for discovery,
              bookings, and services.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-900 pr-8">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-5 pt-2 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-gray-600 text-sm">Still need help?</span>
        <button className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
          Contact support
        </button>
      </div>
    </div>
  );
}
