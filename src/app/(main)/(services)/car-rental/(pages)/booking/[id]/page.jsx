import React from 'react';
import BookingComponent from '@/components/booking_component/Booking';

const BookCar = ({ resortId, serviceType = 'resort' }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <BookingComponent serviceId={resortId} serviceType={serviceType} />
        </div>
    );
};

export default BookCar;