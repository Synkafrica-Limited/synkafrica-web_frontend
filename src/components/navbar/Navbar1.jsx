"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Buttons from '@/components/ui/Buttons';


const Navbar1 = ({ onBecomeVendor }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const moreRef = useRef(null);
  const hoverCloseTimeout = useRef(null);

  // Handle scroll to show/hide search bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 400;

      setIsScrolled(scrollPosition > 50);
      setShowSearchBar(scrollPosition > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock login toggle for demo
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setShowProfileDropdown(false);
  };

  // Fix: Only close dropdown if click is outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setShowMoreDropdown(false);
      }
    }
    if (showMoreDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreDropdown]);

  // Helpers to add a small delay before closing the "More" dropdown
  const openMore = () => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
    setShowMoreDropdown(true);
  };

  const scheduleCloseMore = (delay = 200) => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
    }
    hoverCloseTimeout.current = setTimeout(() => {
      setShowMoreDropdown(false);
      hoverCloseTimeout.current = null;
    }, delay);
  };

  // Cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverCloseTimeout.current) {
        clearTimeout(hoverCloseTimeout.current);
      }
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <>
    <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70 border-b border-gray-100 transition-shadow duration-300 ${isScrolled ? "shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-18">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/images/brand/synkafrica-logo-w-text.png"
                alt="Synkkafrica Logo"
                width={150}
                height={40}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center Content - Search Bar or Navigation */}
          <div className="flex-1 flex justify-center items-center">
            {!showSearchBar ? (
              /* Desktop Navigation Links - Centered when search is hidden */
              <div className="hidden md:flex items-center space-x-8 transition-all duration-300">
                <Link
                  href="/"
                  className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
                >
                  Discover
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/car-rental"
                  className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
                >
                  Car Rental
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
                >
                  Bookings
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {/* More Dropdown */}
                <div
                  className="relative"
                  ref={moreRef}
                  onMouseEnter={openMore}
                  onMouseLeave={() => scheduleCloseMore(200)}
                  tabIndex={1}
                >
                  <button
                    type="button"
                    className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={showMoreDropdown}
                    onClick={() => setShowMoreDropdown((v) => !v)}
                  >
                    More
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {/* Dropdown: keep open while mouse is over dropdown or button */}
                  {showMoreDropdown && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-2xl shadow-lg py-3 z-50 flex flex-col space-y-1 animate-fadeIn"
                      onMouseEnter={openMore}
                      onMouseLeave={() => scheduleCloseMore(200)}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <Link
                        href="/dining-reservations"
                        className="block px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200"
                        onClick={() => setShowMoreDropdown(false)}
                      >
                        Reservations
                      </Link>
                      <Link
                        href="/laundry-service"
                        className="block px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200"
                        onClick={() => setShowMoreDropdown(false)}
                      >
                        Services
                      </Link>
                      <Link
                        href="/beach-resorts"
                        className="block px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200"
                        onClick={() => setShowMoreDropdown(false)}
                      >
                        Beach Resorts
                      </Link>
                      <Link
                      href={'/home/business'}
                        className="block text-left px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 w-full"
                        onClick={() => {
                          setShowMoreDropdown(false);
                          if (typeof onBecomeVendor === "function") onBecomeVendor();
                        }}
                      >
                        Become a vendor
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Center Search Bar - Only visible when scrolled past threshold */
              <div className="hidden md:flex max-w-lg w-full mx-8 transition-all duration-300">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Navigation (when search is visible) + Currency & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {showSearchBar && (
              <div className="flex items-center space-x-6 mr-4">
                <Link
                  href="/discover"
                  className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
                >
                  Discover
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/car-rental"
                  className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
                >
                  Car Rental
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group"
                >
                  Bookings
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {/* More Dropdown */}
                <div
                  className="relative"
                  ref={moreRef}
                  onMouseEnter={openMore}
                  onMouseLeave={() => scheduleCloseMore(200)}
                  tabIndex={1}
                >
                  <button
                    type="button"
                    className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 group focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={showMoreDropdown}
                    onClick={() => setShowMoreDropdown((v) => !v)}
                  >
                    More
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {/* Dropdown: keep open while mouse is over dropdown or button */}
                  {showMoreDropdown && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-2xl shadow-lg py-3 z-50 flex flex-col space-y-1 animate-fadeIn"
                      onMouseEnter={openMore}
                      onMouseLeave={() => scheduleCloseMore(200)}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <Link
                        href="/dining-reservations"
                        className="block px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200"
                        onClick={() => setShowMoreDropdown(false)}
                      >
                        Reservations
                      </Link>
                      <Link
                        href="/laundry-service"
                        className="block px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200"
                        onClick={() => setShowMoreDropdown(false)}
                      >
                        Services
                      </Link>
                      <Link
                        href="/beach-resorts"
                        className="block px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200"
                        onClick={() => setShowMoreDropdown(false)}
                      >
                        Beach Resorts
                      </Link>
                      <Link
                      href={'/home/business'}
                        className="block text-left px-6 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 w-full"
                        onClick={() => {
                          setShowMoreDropdown(false);
                          if (typeof onBecomeVendor === "function") onBecomeVendor();
                        }}
                      >
                        Become a vendor
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Currency Selector */}
            <div className="flex items-center space-x-1 text-sm text-gray-600 group">
              <span className="font-medium group-hover:text-primary-600 transition-colors duration-200">USD</span>
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center transition-colors duration-200 group-hover:border-primary-500">
                <span className="text-orange-500 text-xs">🌍</span>
              </div>
            </div>

            {!isLoggedIn ? (
              // Sign In Button
              <Buttons variant="filled" size="md" className="rounded-full text-secondary-700 hover:bg-primary-200/90" onClick={toggleLogin}>Sign In</Buttons>

            ) : (
              // User Profile
              <div className="relative group">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-colors duration-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Temi Femi
                      </p>
                      <p className="text-xs text-gray-500">temifemi@gmail.com</p>
                    </div>
                    <Link
                      href="/dashboard/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded transition-all duration-200"
                    >
                      Bookings
                    </Link>
                    <Link
                      href="/dashboard/feedback"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded transition-all duration-200"
                    >
                      Write a review
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded transition-all duration-200"
                    >
                      Profile
                    </Link>
                    <div className="border-t border-gray-100 mt-1 px-2 py-2">
                      <Buttons
                        onClick={toggleLogin}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Sign Out
                      </Buttons>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Icon - Only show when search bar should be visible */}
            {showSearchBar && (
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

      </div>
      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-40 animate-fadeIn"
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </nav>
    {/* Mobile Sidebar Overlay (moved outside nav to avoid backdrop/stacking issues) */}
    {isMobileMenuOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fadeIn"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}

    {/* Mobile Sidebar (moved outside nav for proper fixed positioning) */}
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center transition-colors duration-200 hover:border-primary-500">
              <span className="text-orange-500 text-xs">🌍</span>
            </div>
            <span className="font-medium text-gray-900">USD</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-1">
            <Link
              href="/car-rental"
              className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Car rental
            </Link>
            <Link
              href="/dining"
              className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dining
            </Link>
            <Link
              href="/beach-resorts"
              className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beach & Resorts
            </Link>
            <Link
              href="/laundry-service"
              className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Convenience Services
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/write-review"
                  className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Write a review
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Bookings
                </Link>
                <Link
                  href="/messages"
                  className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/dashboard/"
                  className="block py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                href={'/home/business'}
                    className=" flex py-4 hover:px-9 text-gray-900 font-medium hover:bg-primary-50 hover:text-primary-600 w-full rounded-lg transition-all duration-200 border-b border-gray-100 animate-fadeIn"
                    onClick={() => {
                      setShowMoreDropdown(false);
                      if (typeof onBecomeVendor === "function") onBecomeVendor();
                    }}
                  >
                    Become a vendor
                  </Link>
              </>
            )}
            {!isLoggedIn ? (
              <Buttons
                onClick={() => {
                  toggleLogin();
                  setIsMobileMenuOpen(false);
                }}
                variant="filled"
                size="md"
                className="w-full mt-6 rounded-full"
              >
                Sign In
              </Buttons>
            ) : (
              <Buttons
                onClick={() => {
                  toggleLogin();
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                size="md"
                className="w-full text-left border-red-200 text-red-600 hover:bg-red-50"
              >
                Sign Out
              </Buttons>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Navbar1;
