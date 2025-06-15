import "../../styles/globals.css";
import Navbar1 from "../../components/navbar/Navbar1";
import Footer from "../../components/footer/Footer";

export const metadata = {
  title: "SynkAfrica",
  description: "Empowering mobility across Africa",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar1 />
      {children}
      <Footer />
    </div>
  );
}
