"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from '@/components/ui/ToastProvider';
import { useSession } from "@/hooks/customer/auth/useSession";

const Navbar1 = ({ onBecomeVendor }) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const moreRef = useRef(null);
  const hoverCloseTimeout = useRef(null);
  const toast = useToast();


  const { isLoggedIn, user, logout, loading: sessionLoading } = useSession();
  
  // Sync local loading state with session loading
  useEffect(() => {
    setIsLoading(sessionLoading);
  }, [sessionLoading]);



  // Get current path to determine navbar style
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ... (keep handleLogout, navigateToLogin, navigateToRegister functions same)

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      toast?.danger?.(error.message || 'Logout failed. Please try again.');
    } finally {
      setShowProfileDropdown(false);
      setShowMoreDropdown(false);
      router.refresh(); // Refresh the page to update any server components
    }
  };

  // Navigate to login page
  const navigateToLogin = () => {
    router.push('/login');
  };

  // Navigate to register page
  const navigateToRegister = () => {
    router.push('/signup');
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

  // Show loading state
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isLandingPage 
            ? 'bg-[#E05D3D]' 
            : 'bg-white shadow-sm border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <Image
                  src={isLandingPage ? "/images/brand/synkafrica-logo-w-text.png" : "/images/brand/synkafrica-logo-single.png"} 
                  alt="Synkkafrica Logo"
                  width={isLandingPage ? 150 : 40}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Center Navigation Links */}
            <div className="flex-1 flex justify-center items-center">
              
            </div>

            {/* Right Section - Become a vendor & Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Become a vendor button */}
              <Link href="/business">
                <button className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${
                  isLandingPage 
                    ? 'text-white hover:bg-primary-600' 
                    : 'text-gray-600 hover:text-[#E05D3D] hover:bg-gray-50'
                }`}>
                  Become a vendor
                </button>
              </Link>

              {!isLoggedIn ? (
                /* Register and Sign In Buttons */
                <div className="flex items-center space-x-2">
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isLandingPage
                        ? 'text-white border border-white hover:bg-primary-600'
                        : 'text-[#E05D3D] border border-[#E05D3D] hover:bg-orange-50'
                    }`} 
                    onClick={navigateToRegister}
                  >
                    Sign up
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isLandingPage
                        ? 'text-primary-500 bg-white hover:bg-gray-100'
                        : 'text-white bg-[#E05D3D] hover:bg-[#c54a2a]'
                    }`} 
                    onClick={navigateToLogin}
                  >
                    Sign in
                  </button>
                </div>
              ) : (
                // User Profile
                <div className="relative group">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-colors duration-200 ${
                      isLandingPage
                        ? 'border-white hover:border-gray-200'
                        : 'border-[#E05D3D] hover:border-[#c54a2a]'
                    }`}
                  >
                    <img
                      src={user?.avatar || "/images/default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";
                      }}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 animate-fadeIn border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email || ""}</p>
                      </div>
                      <Link
                        href="/dashboard/bookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-all duration-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Bookings
                      </Link>
                      <Link
                        href="/dashboard/feedback"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-all duration-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Write a review
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-all duration-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Profile
                      </Link>
                      <div className="mt-1 px-2 py-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
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
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isLandingPage
                    ? 'text-white hover:text-gray-200 hover:bg-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
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
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileDropdown(false)}
          ></div>
        )}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s cubic-bezier(0.4,0,0.2,1);
          }
        `}</style>
      </nav>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-end p-6 border-b border-gray-100">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-full transition-all duration-200"
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
            <div className="p-6 space-y-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      navigateToLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigateToRegister();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-primary-600 border border-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                  <Link
                    href="/business"
                    className="block w-full px-4 py-3 text-sm font-medium text-center text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become a Vendor
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/business"
                    className="block w-full px-4 py-3 text-sm font-medium text-center text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become a Vendor
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar1;