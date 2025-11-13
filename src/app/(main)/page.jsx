import HomePageHero from "../home/(customer)/components/HeroSection";
import AboutService from "../home/(customer)/components/AboutServiceSection";
import OtherServicesLinks from "../home/(customer)/components/OtherServicesLinksSection";
import CarRentalService from "../home/(customer)/components/CarRentalServiceSection";
import FAQComponent from "../home/(customer)/components/FaqSection.jsx";
import ExploreOtherServices from "../home/(customer)/components/ExploreOtherServicesSection"
import VendorBanner from "../home/(customer)/components/BecomeVendorSection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        <HomePageHero />
        <AboutService service="car" />
        <CarRentalService />
        <OtherServicesLinks />
        <ExploreOtherServices />
        <VendorBanner />
        <FAQComponent />
      </div>
    </main>
  );
}
