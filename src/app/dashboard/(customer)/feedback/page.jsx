// src/app/dashboard/reviews/page.jsx
"use client";
import { useState } from "react";
import Buttons from "@/components/ui/Buttons";
import FeedbackSuccess from "@/components/dashboard/customer/feedback/FeedbackSuccess";
import { 
  MessageSquare, 
  Car, 
  Calendar, 
  Star, 
  Coffee, 
  MoreHorizontal,
  Send,
  HelpCircle,
  Mail
} from "lucide-react";

export default function ReviewsPage() {
  const [category, setCategory] = useState("Transportation");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: "Transportation", icon: Car, label: "Transportation" },
    { id: "Reservations", icon: Calendar, label: "Reservations" },
    { id: "Experiences", icon: Star, label: "Experiences" },
    { id: "Convenience Services", icon: Coffee, label: "Services" },
    { id: "Other", icon: MoreHorizontal, label: "Other" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
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
        contactMail="info@synkkafrica.com"
        exploreUrl="/"
        exploreText="Synkkafrica"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col gap-1">
              <nav className="text-sm text-gray-500 flex items-center gap-2">
                <span>Dashboard</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-medium">Feedback</span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Share your experience
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl">
                We value your input. Help us improve our services by sharing your thoughts, suggestions, or issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    What is your feedback about?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? "border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500"
                              : "border-gray-200 bg-white text-gray-600 hover:border-primary-200 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-primary-600" : "text-gray-400"}`} />
                          <span className="text-sm font-medium">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="feedback">
                    Tell us more
                  </label>
                  <div className="relative">
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      rows={6}
                      placeholder="Share your thoughts, suggestions, or report an issue..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition resize-none placeholder:text-gray-400"
                      required
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                      {feedback.length} characters
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    Your feedback will be sent directly to our product team.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Buttons
                    variant="filled"
                    size="lg"
                    type="submit"
                    disabled={sending || !feedback.trim()}
                    className={`w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary-500/20 ${
                      sending || !feedback.trim()
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:-translate-y-0.5 transition-transform"
                    }`}
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </Buttons>
                </div>
              </form>
            </div>
          </div>

          {/* Side Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-primary-500/20 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Need direct support?</h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  If you have a specific question or need immediate assistance with a booking, our support team is here to help.
                </p>
                <button 
                  onClick={() => window.open("mailto:info@synkkafrica.com", "_blank")}
                  className="w-full py-2.5 px-4 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  Contact Support
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">We're listening</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We read every piece of feedback. While we can't respond to everyone individually, your input directly influences our roadmap and improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
