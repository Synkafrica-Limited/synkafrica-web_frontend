import Link from "next/link";
import Image from "next/image";
import Button from "../ui/buttons";
//icon
import { IoLogoTwitter, IoLogoFacebook, IoArrowForward, IoLogoInstagram } from "react-icons/io5";


const Footer = () => {
  return (
    <footer
      className="py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/images/patterns/footer-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Logo and Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          {/* Logo */}
          <Image
            src="/images/brand/synkafrica-logo-single.png"
            alt="Synk Africa Logo"
            width={40}
            height={20}
          />

          {/* Main Navigation */}
          <nav className="hidden lg:flex space-x-8 mb-6 lg:mb-0">
            <Link
              href="/about"
              className="text-md text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/careers"
              className="text-md text-gray-600 hover:text-gray-900 transition-colors"
            >
              Careers
            </Link>
            <Link
              href="/partner"
              className="text-md text-gray-600 hover:text-gray-900 transition-colors"
            >
              Partner With Us
            </Link>
            <Link
              href="/discover"
              className="text-md text-gray-600 hover:text-gray-900 transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/support"
              className="text-md text-gray-600 hover:text-gray-900 transition-colors"
            >
              Support
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex space-x-3">
            <a
              href="#"
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <IoLogoFacebook className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <IoLogoTwitter className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <IoLogoInstagram className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/laundry-service"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Convenience Services
                </Link>
              </li>
              <li>
                <Link
                  href="/dining-reservations"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dining & Restaurant Reservations
                </Link>
              </li>
              <li>
                <Link
                  href="/car-rental"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Car Rentals
                </Link>
              </li>
              <li>
                <Link
                  href="/services/flights"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Flights Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/services/vendor-listings"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Vendor listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Become a vendor */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Become a vendor
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/vendor/list-cars"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  List your cars
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/showcase"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Showcase your services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>3 Adamo Street, Lekki Phase 1</p>
              <p>Lagos State</p>
              <p className="mt-4">
                <a
                  href="tel:+1 8573 032 9886"
                  className="hover:text-gray-900 transition-colors"
                >
                  +1 8573 032 9886
                </a>
              </p>
              <p>
                <a
                  href="tel:+1 8573 032 9886"
                  className="hover:text-gray-900 transition-colors"
                >
                  +1 8573 032 9886
                </a>
              </p>
              <p className="mt-4">
                <a
                  href="mailto:info@synkkafrica.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  info@synkkafrica.com
                </a>
              </p>
            </div>
          </div>

          {/* Site */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Site</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4 lg:mb-0">
            Copyright © 2025 synKKafrica | All Right Reserved
          </p>
          <Link href="/signup">
          <Button
            variant="filled"
            icon={
              <IoArrowForward className="w-5 h-5" />
            }
            className="bg-[#E26A3D] text-white font-semibold rounded-md px-6 py-2 hover:bg-[#E26A3D]/90 transition-colors"
            size="md"
          >
            Sign Up
          </Button>
          </Link>
          
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden mt-8 pt-8 border-t border-gray-200">
          <nav className="grid grid-cols-2 gap-4">
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/careers"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Careers
            </Link>
            <Link
              href="/partner"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Partner With Us
            </Link>
            <Link
              href="/explore"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/support"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Support
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
