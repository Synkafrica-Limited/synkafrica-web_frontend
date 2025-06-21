import Link from "next/link";
import Image from "next/image";

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

          {/* Social Icons */}
          <div className="flex space-x-3">
            <a
              href="#"
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <span className="text-white font-bold text-sm">X</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.757-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017.001z" />
              </svg>
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
                  href="/services/convenience"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Convenience Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services/dining"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dining & Restaurant Reservations
                </Link>
              </li>
              <li>
                <Link
                  href="./"
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
              <p>Victoria Island, Maryland</p>
              <p>Expressway, Lagos State</p>
              <p className="mt-4">
                <a
                  href="tel:+2340812323392"
                  className="hover:text-gray-900 transition-colors"
                >
                  +234 0812 323 392
                </a>
              </p>
              <p>
                <a
                  href="tel:+2340812123392"
                  className="hover:text-gray-900 transition-colors"
                >
                  +234 0812 123 392
                </a>
              </p>
              <p className="mt-4">
                <a
                  href="mailto:info@synkafrica.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  info@synkafrica.com
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
            Copyright © 2025 synKafrica | All Right Reserved
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <span>Sign Up</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
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
