// src/app/dashboard/reviews/page.jsx
"use client";
import { useState } from "react";
import Button from "@/components/ui/buttons";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import FeedbackSuccess from "@/components/dashboard/customer/feedback/FeedbackSuccess";

export default function ReviewsPage() {
  const [category, setCategory] = useState("Transportation");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "Transportation",
    "Reservations",
    "Experiences",
    "Convenience Services",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFeedback("");
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <FeedbackSuccess
        successMessage="Your feedback has been submitted successfully!"
        contactMail="support@synkafrica.com"
        exploreUrl="/"
        exploreText="Synkafrica"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-2 sm:px-6 py-8">
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-10">
        {/* Left: Review Form */}
        <div className="flex-1">
          <nav className="text-xs text-gray-400 mb-2">
            Profile &gt; <span className="text-gray-300">Reviews</span>
          </nav>
          <h1 className="text-2xl font-semibold mb-2">Share your reviews</h1>
          <hr className="mb-4" />
          <div className="text-gray-600 text-sm mb-6 max-w-xl">
            Thanks for sending us your ideas, issues, or appreciations. We can’t respond individually, but we’ll pass it on to the teams who are working to help make Synkafrica better for everyone.
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="category">
                What’s your feedback about?
              </label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#E26A3D] transition"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="feedback">
                Write your feedback below
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={6}
                className="w-full border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#E26A3D] transition resize-none"
                required
              />
            </div>
            <Button
              variant="filled"
              size="md"
              type="submit"
              disabled={sending || !feedback.trim()}
              className={`w-full md:w-auto bg-[#E26A3D]/20 text-[#E26A3D] font-semibold rounded-md px-8 py-2 transition ${
                sending || !feedback.trim()
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-[#E26A3D]/30"
              }`}
            >
              {sending ? "Sending..." : "Send review"}
            </Button>
          </form>
        </div>
        {/* Right: Contact Us */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white border border-[#E26A3D]/30 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="font-semibold text-base mb-2">Need to get in touch?</div>
            <div className="text-gray-600 text-sm mb-4">
              If you do have a specific question, or need help resolving a problem, you can connect with our support team.
            </div>
            <Button
              variant="outline"
              size="md"
              className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-6 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
              onClick={() => window.open("mailto:support@synkafrica.com", "_blank")}
            >
              Contact us
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
