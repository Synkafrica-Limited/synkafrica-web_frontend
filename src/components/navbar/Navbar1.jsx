'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar1 = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Handle scroll to show/hide search bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 400;
      
      setIsScrolled(scrollPosition > 50);
      setShowSearchBar(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock login toggle for demo
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setShowProfileDropdown(false);
  };

  return (
    <nav className={`bg-white border-b border-gray-50 sticky top-0 z-50 transition-shadow duration-300 ${
      isScrolled ? 'shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div> */}
              <span className="text-xl font-semibold text-gray-900">Synkafrica</span>
            </Link>
          </div>

          {/* Center Content - Search Bar or Navigation */}
          <div className="flex-1 flex justify-center items-center">
            {!showSearchBar ? (
              /* Desktop Navigation Links - Centered when search is hidden */
              <div className="hidden md:flex items-center space-x-8 transition-all duration-300">
                <Link href="/discover" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Discover
                </Link>
                <Link href="/rental-cars" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Rental Cars
                </Link>
                <Link href="/review" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Review
                </Link>
                <Link href="/more" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  More
                </Link>
              </div>
            ) : (
              /* Center Search Bar - Only visible when scrolled past threshold */
              <div className="hidden md:flex max-w-lg w-full mx-8 transition-all duration-300">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
            {/* Navigation Links - Move to right when search is visible */}
            {showSearchBar && (
              <div className="flex items-center space-x-6 mr-4">
                <Link href="/discover" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Discover
                </Link>
                <Link href="/rental-cars" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Rental Cars
                </Link>
                <Link href="/review" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Review
                </Link>
                <Link href="/more" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  More
                </Link>
              </div>
            )}
            {/* Currency Selector */}
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span className="font-medium">USD</span>
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="text-orange-500 text-xs">🌍</span>
              </div>
            </div>

            {!isLoggedIn ? (
              // Sign In Button
              <button
                onClick={toggleLogin}
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                Sign In
              </button>
            ) : (
              // User Profile
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">john@example.com</p>
                    </div>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Orders
                    </Link>
                    <Link href="/write-review" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Write a review
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Profile Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={toggleLogin}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
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
              <button className="p-2 text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
            
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              {/* Currency Selector */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                  <span className="text-orange-500 text-xs">🌍</span>
                </div>
                <span className="font-medium text-gray-900">USD</span>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-1">
                {/* Service Categories */}
                <Link 
                  href="/car-rental" 
                  className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Car rental
                </Link>
                <Link 
                  href="/dining" 
                  className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dinning
                </Link>
                <Link 
                  href="/beach-resorts" 
                  className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beach & Resorts
                </Link>
                <Link 
                  href="/laundry-services" 
                  className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Laundry Services
                </Link>

                {/* User Actions */}
                {isLoggedIn && (
                  <>
                    <Link 
                      href="/write-review" 
                      className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Write a review
                    </Link>
                    <Link 
                      href="/bookings" 
                      className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                    <Link 
                      href="/messages" 
                      className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/account-info" 
                      className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Account Info
                    </Link>
                    <Link 
                      href="/list-property" 
                      className="block py-4 text-gray-900 font-medium hover:text-orange-500 transition-colors border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      List your property
                    </Link>
                  </>
                )}

                {/* Auth Section */}
                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      toggleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full mt-6 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      toggleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-4 text-gray-900 font-medium hover:text-red-600 transition-colors border-b border-gray-100"
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar1;