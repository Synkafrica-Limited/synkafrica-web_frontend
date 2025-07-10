"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Users, DoorOpen, Snowflake, Settings, Gauge, MapPin } from "lucide-react";

export default function ReviewPage() {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmitReview = async () => {
    setSending(true);
    try {
      console.log("Review submitted:", { rating, review });
      // Handle review submission logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      router.push("/feedback-received");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>Profile</span>
            <span>/</span>
            <span className="text-gray-400">Reviews</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Review Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Write your review
                </h1>
                
                <p className="text-gray-600 mb-6">Rate your experience</p>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      className="p-1 transition-colors"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= (hoveredStar || rating)
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                {/* Review Text Area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write your review below
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  disabled={sending || !review.trim()}
                  className={`w-full md:w-auto bg-[#E26A3D]/20 text-[#E26A3D] font-semibold rounded-md px-8 py-2 transition ${
                    sending || !review.trim()
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-[#E26A3D]/30"
                  }`}
                >
                  {sending ? "Sending..." : "Send review"}
                </button>
              </div>
            </div>

            {/* Car Details Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Great Deal Badge */}
                <div className="inline-flex items-center bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                  Great Deal
                </div>

                {/* Luxury Package */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-900">Luxury Package</span>
                  <div className="bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded">
                    PLUS
                  </div>
                </div>

                {/* Car Model */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mercedes Benz Gle Coupe AMG
                </h3>

                {/* Car Features */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">4 Passengers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DoorOpen size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">4 Doors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Snowflake size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Air Conditioning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Automatic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Unlimited mileage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Fuel: Full tank</span>
                  </div>
                </div>

                {/* Car Image */}
                <div className="mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Mercedes Benz GLE Coupe AMG"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">$125</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}