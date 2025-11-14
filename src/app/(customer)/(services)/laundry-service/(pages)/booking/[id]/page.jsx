"use client";

import React from "react";
import BookingForm from "@/app/(customer)/(services)/components/booking_flow/booking";

const LaundryBookingForm = ({ resortId, serviceType = "laundry" }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookingForm
        serviceType={serviceType}
        initialContactDetails={{}}
        initialAddressDetails={{}}
        companyName="YourCompany"
        onBookingComplete={(bookingData) => {}}
      />
    </div>
  );
};

export default LaundryBookingForm;
