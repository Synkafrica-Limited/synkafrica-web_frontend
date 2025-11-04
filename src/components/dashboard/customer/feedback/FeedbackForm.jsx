import { useState } from "react";
import Buttons from "@/components/ui/Buttons";
import { HiOutlineEmojiHappy } from "react-icons/hi";

/**
 * FeedbackForm
 * @param {Object} props
 * @param {string[]} [props.categories] - Array of feedback categories
 * @param {function} [props.onSubmit] - Callback on submit, receives ({ category, feedback })
 * @param {string} [props.successMessage] - Custom success message
 * @param {string} [props.title] - Title for the form
 * @param {string} [props.description] - Description for the form
 * @param {string} [props.contactMail] - Email for contact us
 */
export default function FeedbackForm({
  categories = [
    "Transportation",
    "Reservations",
    "Experiences",
    "Convenience Services",
    "Other",
  ],
  onSubmit,
  successMessage = "Your feedback has been submitted successfully!",
  title = "Share your reviews",
  description = "Thanks for sending us your ideas, issues, or appreciations. We can’t respond individually, but we’ll pass it on to the teams who are working to help make Synkkafrica better for everyone.",
  contactMail = "info@synkkafrica.com",
}) {
  const [category, setCategory] = useState(categories[0]);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    if (onSubmit) {
      await onSubmit({ category, feedback });
    }
    setTimeout(() => {
      setSending(false);
      setFeedback("");
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col px-2 sm:px-6 py-8">
        <div className="max-w-3xl w-full flex flex-col items-center">
          {/* Success notification */}
          <div className="mb-6 w-full">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          </div>
          <nav className="text-xs text-gray-400 mb-2 w-full">
            Profile &gt; <span className="text-gray-300">Reviews</span>
          </nav>
          <h1 className="text-2xl font-semibold mb-2 w-full">Thanks for your feedback!</h1>
          <hr className="mb-4 w-full" />
          <div className="text-gray-700 text-base mb-4 w-full">
            We appreciate you sharing your ideas and comments. If you need help resolving a problem, feel free to{" "}
            <a
              href={`mailto:${contactMail}`}
              className="text-[#E26A3D] underline hover:text-[#c2552e]"
              target="_blank"
              rel="noopener noreferrer"
            >
              contact us
            </a>.
          </div>
          <div className="text-base w-full mb-8">
            Continue exploring{" "}
            <a
              href="/"
              className="text-[#E26A3D] underline hover:text-[#c2552e]"
            >
              Synkkafrica
            </a>
          </div>
          {/* Illustration */}
          <div className="flex flex-col items-center mt-8 w-full">
            <HiOutlineEmojiHappy className="text-[#E26A3D] mb-4" style={{ fontSize: 120 }} />
            <div className="text-lg text-gray-500 font-medium">Your voice makes Synkkafrica better for everyone!</div>
          </div>
        </div>
      </div>
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
          <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          <hr className="mb-4" />
          <div className="text-gray-600 text-sm mb-6 max-w-xl">
            {description}
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
            <Buttons
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
            </Buttons>
          </form>
        </div>
        {/* Right: Contact Us */}
        <aside className="w-full md:w-72 flex-shrink-0 mt-8 md:mt-0">
          <div className="bg-white border border-[#E26A3D]/30 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="font-semibold text-base mb-2">Need to get in touch?</div>
            <div className="text-gray-600 text-sm mb-4">
              If you do have a specific question, or need help resolving a problem, you can connect with our support team.
            </div>
            <Buttons
              variant="outline"
              size="md"
              className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-6 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
              onClick={() => window.open(`mailto:${contactMail}`, "_blank")}
            >
              Contact us
            </Buttons>
          </div>
        </aside>
      </div>
    </div>
  );
}