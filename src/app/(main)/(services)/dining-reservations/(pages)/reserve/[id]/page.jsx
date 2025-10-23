"use client"

import React from "react";
import BookingForm from "@/app/(main)/(services)/components/booking_flow/booking";

const BookDiningReservation = ({ resortId, serviceType = "dining" }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookingForm
        serviceType="dining"
        initialContactDetails={{}}
        initialAddressDetails={{}}
        companyName="YourCompany"
        onBookingComplete={(bookingData) => {}}
      />
    </div>
  );
};

export default BookDiningReservation;
