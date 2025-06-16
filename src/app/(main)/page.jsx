import BookingFlow from '@/components/booking_flow';
import ExperiencesSection from './customer_landingpage/ExperiencesSection';
import BecomeVendorSection from './customer_landingpage/Become_a_vendorSection';
import ExploreCarsSection from './customer_landingpage/Explore_cars';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <BookingFlow />
      <ExperiencesSection />
      <BecomeVendorSection />
      <ExploreCarsSection />
    </main>

  );
}
