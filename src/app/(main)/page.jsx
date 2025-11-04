import HomePageHero from "../customer_landingpage/components/HeroSection";
import AboutService from "../customer_landingpage/components/AboutServiceSection";
import OtherServicesLinks from "../customer_landingpage/components/OtherServicesLinksSection";
import CarRentalService from "../customer_landingpage/components/CarRentalServiceSection";
import FAQComponent from "../customer_landingpage/components/FaqSection.jsx";
import ExploreOtherServices from "../customer_landingpage/components/ExploreOtherServicesSection"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        <HomePageHero />
        <AboutService service="car" />
        <CarRentalService />
        <OtherServicesLinks />
        <ExploreOtherServices />
        <FAQComponent />
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
