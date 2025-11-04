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
