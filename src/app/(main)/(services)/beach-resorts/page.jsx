import BeachServicesGrid from "./components/BeachServicesGrid";
import BookingFlow from "@/components/booking_flow/Booking_flow";

export default function BeachResortsPage() {
  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        <BookingFlow />
        <BeachServicesGrid />
        <br />
        <br />
      </div>
    </main>
  );
}