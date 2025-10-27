import ExploreBeachSection from "@/app/home/(customer)/components/Expore_beaches";
import ExploreDiningSection from "@/app/home/(customer)/components/Explore_dining";
import ExploreCarsSection from "@/app/home/(customer)/components/Explore_cars";
import ExperiencesSection from "@/app/home/(customer)/components/ExperiencesSection";
import BecomeVendorSection from "@/app/home/(customer)/components/Become_a_vendorSection";
import FaqSection from "@/app/home/(customer)/components/Faqs";
import BookingFlow from "@/components/booking_flow/Booking_flow";

export default function CustomerExplorePage() {
    return (
        <main className="space-y-12">
            <BookingFlow />
            <ExploreCarsSection />
            <ExperiencesSection />
            <BecomeVendorSection />
            <ExploreBeachSection />
            <ExploreDiningSection />
            <FaqSection />
        </main>
    );
}

