import "../../styles/globals.css";
import AppClientWrapper from "@/components/layout/AppClientWrapper";
import Footer from "../../components/footer/Footer";
import { BookingProvider } from "@/context/BookingContext";
import { OrderProvider } from "@/context/OrderContext";

export const metadata = {
  title: "SynKKafrica",
  description: "Empowering mobility across Africa",
};

export default function RootLayout({ children }) {
  return (
    <BookingProvider>
      <OrderProvider>
        <div>
          <AppClientWrapper>
            {children}
          </AppClientWrapper>
          <Footer />
        </div>
      </OrderProvider>
    </BookingProvider>
  );
}
