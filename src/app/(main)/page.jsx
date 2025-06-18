import BookingFlow from '@/components/booking_flow/Booking_flow';
import ExperiencesSection from '../customer_landingpage/ExperiencesSection';
import BecomeVendorSection from '../customer_landingpage/Become_a_vendorSection';
import ExploreCarsSection from '../customer_landingpage/Explore_cars';
import ExploreDiningSection from '../customer_landingpage/Explore_dining';
import ExploreBeachSection from '../customer_landingpage/Expore_beaches';
import FaqSection from '../customer_landingpage/Faqs';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="space-y-5">
        <BookingFlow />
        <ExperiencesSection />
        <BecomeVendorSection />
        <ExploreCarsSection />
        <ExploreDiningSection />
        <ExploreBeachSection/>
        <FaqSection/>
      </div>
    </main>
  );
}
