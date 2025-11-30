"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Waves, Clock, MapPin, Users, Umbrella } from "lucide-react";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

export default function BeachLocationDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!id) return;
    setBooking({
      id,
      service: "Beach Location",
      name: "Paradise Beach Resort",
      type: "Premium Beach Access",
      date: "Aug 20, 2024",
      time: "10:00 AM - 6:00 PM",
      amount: "$45",
      status: "Completed",
      location: "Tarkwa Bay Beach, Lagos",
      guests: 4,
      amenities: ["Beach chairs", "Umbrella", "Towel service", "Changing room"],
      bookingRef: "BCH001234",
      weatherCondition: "Sunny, 28°C",
      accessCode: "BEACH2024",
    });
  }, [id]);

  if (!booking) {
    return <PageLoadingScreen message="Loading booking details..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <nav className="text-sm text-gray-500">
            <span>Bookings</span>
            <span className="mx-2">›</span>
            <span className="text-gray-400">Beach Location Details</span>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Waves className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{booking.name}</h1>
                  <p className="text-gray-600">{booking.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{booking.amount}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Visit Details</h3>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Date & Time</p>
                  <p className="text-sm text-gray-600">{booking.date}</p>
                  <p className="text-sm text-gray-600">{booking.time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Guests</p>
                  <p className="text-sm text-gray-600">{booking.guests} people</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{booking.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Amenities & Details</h3>

              <div className="flex items-start space-x-3">
                <Umbrella className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Included Amenities</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {booking.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Weather Condition</p>
                <p className="text-sm text-gray-600">{booking.weatherCondition}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Access Code</p>
                <p className="text-sm text-gray-600 font-mono">{booking.accessCode}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Booking Reference</p>
                <p className="text-sm text-gray-600 font-mono">{booking.bookingRef}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Book Again
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Leave a Review
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
