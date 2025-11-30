import "../../styles/globals.css";
import AppClientWrapper from "@/components/layout/AppClientWrapper";
import Footer from "../../components/footer/Footer";

export const metadata = {
  title: "SynKKafrica",
  description: "Empowering mobility across Africa",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <AppClientWrapper>
        {children}
      </AppClientWrapper>
      <Footer />
    </div>
  );
}
