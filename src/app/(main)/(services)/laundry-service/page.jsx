import LaundryServicesGrid from './components/LaundryServiceCard';
import BookingFlow from '../../../../components/booking_flow/Booking_flow'

export default function LaundryServicePage() {
  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        <BookingFlow />
        <LaundryServicesGrid />
        <br />
        <br />
      </div>
    </main>
  );
}