import BookingFlow from "@/components/booking_flow/Booking_flow";
import ExperiencesSection from "../customer_landingpage/ExperiencesSection";
import BecomeVendorSection from "../customer_landingpage/Become_a_vendorSection";
import ExploreCarsSection from "../customer_landingpage/Explore_cars";
import ExploreDiningSection from "../customer_landingpage/Explore_dining";
import ExploreBeachSection from "../customer_landingpage/Expore_beaches";
import FaqSection from "../customer_landingpage/Faqs";

import HomePageHero from "../customer_landingpage/components/HeroSection";
import AboutService from "../customer_landingpage/components/AboutService";
import OtherServicesLinks from "../customer_landingpage/components/OtherServicesLinks";
import CarRentalService from "../customer_landingpage/components/CarRentalService";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        <HomePageHero />
        <AboutService service="car" />
        <CarRentalService />
        <OtherServicesLinks />
        {/* <ExperiencesSection /> */}
        {/* <BecomeVendorSection /> */}
        {/* <ExploreCarsSection /> */}
        {/* <ExploreDiningSection /> */}
        {/* <ExploreBeachSection /> */}
        {/* <FaqSection /> */}
      </div>
    </main>
  );
}
