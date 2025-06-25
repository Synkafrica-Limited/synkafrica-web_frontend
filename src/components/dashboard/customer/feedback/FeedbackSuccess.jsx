import { HiOutlineEmojiHappy } from "react-icons/hi";

/**
 * FeedbackSuccess
 * @param {Object} props
 * @param {string} [props.successMessage]
 * @param {string} [props.contactMail]
 * @param {string} [props.exploreUrl]
 * @param {string} [props.exploreText]
 */
export default function FeedbackSuccess({
  successMessage = "Your feedback has been submitted successfully!",
  contactMail = "support@synkafrica.com",
  exploreUrl = "/",
  exploreText = "Synkafrica",
}) {
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
            href={exploreUrl}
            className="text-[#E26A3D] underline hover:text-[#c2552e]"
          >
            {exploreText}
          </a>
        </div>
        {/* Illustration */}
        <div className="flex flex-col items-center mt-8 w-full">
          <HiOutlineEmojiHappy className="text-[#E26A3D] mb-4" style={{ fontSize: 120 }} />
          <div className="text-lg text-gray-500 font-medium">Your voice makes Synkafrica better for everyone!</div>
        </div>
      </div>
    </div>
  );
}