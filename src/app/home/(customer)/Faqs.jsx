"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Ensure you have lucide-react installed


const faqs = [
  {
    question: "How do I find booking deals on Synkkafrica?",
    answer:
      "Simply use one of our booking simplified search engine to scan for deal gathered from different businesses. Synkkafrica search results pages have loads of filter options to assist you find deals suitable for you.",
  },
  {
    question: "What makes Synkkafrica a great booking app?",
    answer:
      "On the Synkkafrica app you’ll find various great booking offers found on the website and much more. Plus you get notifications directly to your phone. The Synkkafrica app is much more than just booking app.",
  },
  {
    question: "How do I use Synkkafrica to manage my bookings",
    answer:
      "Synkkafrica  create a booking option in the menu section, you’ll get information about your completed bookings, and your future bookings already made. You can also make changes or cancel bookings.",
  },
  {
    question: "How do I use Synkkafrica to manage my convenience services?",
    answer: "",
  },
];

function FaqItem({ question, answer, open, onClick }) {
  return (
    <div className="border-b border-gray-300 pb-4 mb-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-md font-medium">{question}</span>
        <span className="w-6 h-6 flex items-center justify-center">
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </span>
      </button>
      {open && answer && (
        <div className="mt-2 text-gray-700 text-base">{answer}</div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState([0, 1, 2]);

  const handleToggle = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">
        Frequently asked questions about Synkkafrica
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {faqs.map((faq, idx) => (
          <div key={idx}>
            <FaqItem
              question={faq.question}
              answer={faq.answer}
              open={openIndexes.includes(idx)}
              onClick={() => handleToggle(idx)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}