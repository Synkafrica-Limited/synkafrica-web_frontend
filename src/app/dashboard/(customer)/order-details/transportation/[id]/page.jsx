"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Car, Clock, MapPin, CreditCard } from "lucide-react";

export default function TransportationDetails() {
  const router = useRouter();
  const { id } = useParams(); // ✅ App Router param
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!id) return;
    // TODO: swap to real API call
    setBooking({
      id,
      service: "Car rental",
      type: "Mercedes-Benz",
      model: "C-Class Sedan",
      startDate: "Aug 11, 2024",
      endDate: "Aug 14, 2024",
      amount: "$125",
      status: "Completed",
      pickupLocation: "123 Airport Terminal, Lagos",
      dropoffLocation: "456 Hotel Plaza, Victoria Island",
      duration: "3 days",
      bookingRef: "TR001234",
      driverName: "John Adebayo",
      driverPhone: "+234 901 234 5678",
      plateNumber: "LAG 123 ABC",
    });
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
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
            <span className="text-gray-400">Transportation Details</span>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Car className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {booking.service}
                  </h1>
                  <p className="text-gray-600">
                    {booking.type} - {booking.model}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {booking.amount}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Trip Information
              </h3>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">{booking.duration}</p>
                  <p className="text-xs text-gray-500">
                    {booking.startDate} - {booking.endDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Pickup Location
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.pickupLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drop-off Location
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.dropoffLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Driver & Vehicle
              </h3>

              <div>
                <p className="text-sm font-medium text-gray-900">Driver</p>
                <p className="text-sm text-gray-600">{booking.driverName}</p>
                <p className="text-sm text-blue-600">{booking.driverPhone}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Vehicle Plate Number
                </p>
                <p className="text-sm text-gray-600">{booking.plateNumber}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Booking Reference
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  {booking.bookingRef}
                </p>
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
