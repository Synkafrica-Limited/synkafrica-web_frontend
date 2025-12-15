import Link from "next/link";
import Image from "next/image";
import Buttons from '@/components/ui/Buttons'
//icon
import { IoLogoTwitter, IoLogoFacebook, IoArrowForward, IoLogoInstagram } from "react-icons/io5";


const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/?service=car"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Car Rentals
                </Link>
              </li>
              <li>
                <Link
                  href="/?service=resort"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Beach & Resorts
                </Link>
              </li>
              <li>
                <Link
                  href="/?service=dining"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Dining
                </Link>
              </li>
              <li>
                <Link
                  href="/?service=water"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Water Recreation
                </Link>
              </li>
              <li>
                <Link
                  href="/?service=other"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Other Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/business"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link
                  href="/business"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Partner with Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-[#E05D3D] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>3 Adamo Street</p>
              <p>Lekki Phase 1, Lagos</p>
              <p className="mt-3">
                <a
                  href="tel:+18573032988"
                  className="hover:text-[#E05D3D] transition-colors"
                >
                  +1 857 303 2988
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@synkkafrica.com"
                  className="hover:text-[#E05D3D] transition-colors"
                >
                  info@synkkafrica.com
                </a>
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <IoLogoFacebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Twitter"
              >
                <IoLogoTwitter className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Instagram"
              >
                <IoLogoInstagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/brand/synkafrica-logo-single.png"
                alt="Synk Africa Logo"
                width={24}
                height={24}
              />
              <p className="text-sm text-gray-600">
                © 2025 SynkkAfrica. All rights reserved.
              </p>
            </div>
            <Link href="/signup">
              <Buttons
                variant="filled"
                icon={<IoArrowForward className="w-4 h-4" />}
                className="bg-[#E05D3D] text-white font-semibold rounded-md px-6 py-2 hover:bg-[#c54a2a] transition-colors"
                size="md"
              >
                Get Started
              </Buttons>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
