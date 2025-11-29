"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from '@/components/ui/ToastProvider';

const Navbar1 = ({ onBecomeVendor }) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const moreRef = useRef(null);
  const hoverCloseTimeout = useRef(null);
  const toast = useToast();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        setIsLoggedIn(false);
        setUserProfile(null);
        return;
      }

      // Verify token and fetch user profile
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsLoggedIn(true);
        setUserProfile(userData);
      } else {
        // Token is invalid or expired
        clearAuthToken();
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Token management helpers
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  const setAuthToken = (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  };

  const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  };

  // Handle user login
  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
        setIsLoggedIn(true);
        setUserProfile(data.user);
        setShowProfileDropdown(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast?.danger?.(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      const token = getAuthToken();
      
      // Call logout API to invalidate token on server
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuthToken();
      setIsLoggedIn(false);
      setUserProfile(null);
      setShowProfileDropdown(false);
      setShowMoreDropdown(false);
      router.refresh(); // Refresh the page to update any server components
    }
  };

  // Handle user registration
  const handleRegister = async (userData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
        setIsLoggedIn(true);
        setUserProfile(data.user);
        setShowProfileDropdown(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast?.danger?.(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
      <nav className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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

            {/* Center Navigation Links */}
            <div className="flex-1 flex justify-center items-center">
              
            </div>

            {/* Right Section - Become a vendor & Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Become a vendor button */}
              <a href="../business">
                <button className="px-4 py-2 text-sm font-medium text-primary-500 hover:bg-primary-50 rounded-md transition-colors duration-200 whitespace-nowrap">
                  Become a vendor
                </button>
              </a>

              {!isLoggedIn ? (
                /* Register and Sign In Buttons */
                <div className="flex items-center space-x-2">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-primary-500 border border-primary-500 hover:bg-primary-50 rounded-md transition-colors duration-200" 
                    onClick={navigateToRegister}
                  >
                    Sign up
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 rounded-md transition-colors duration-200" 
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
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-primary-500 transition-colors duration-200"
                  >
                    <img
                      src={userProfile?.avatar || "/images/default-avatar.png"}
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
                          {userProfile?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{userProfile?.email || ""}</p>
                      </div>
                      <a
                        href="/dashboard/bookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-all duration-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Bookings
                      </a>
                      <a
                        href="/dashboard/feedback"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-all duration-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Write a review
                      </a>
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-all duration-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Profile
                      </a>
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
                className="p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-full transition-all duration-200"
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
            <div className="p-6 space-y-1">
              <a
                href="/car-rental"
                className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Car rental
              </a>
              <a
                href="/dining"
                className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dining
              </a>
              <a
                href="/beach-resorts"
                className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Beach & Resorts
              </a>
              <a
                href="/laundry-service"
                className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Convenience Services
              </a>
              {isLoggedIn && (
                <>
                  <a
                    href="/write-review"
                    className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Write a review
                  </a>
                  <a
                    href="/dashboard/bookings"
                    className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bookings
                  </a>
                  <a
                    href="/messages"
                    className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Messages
                  </a>
                  <a
                    href="/dashboard/"
                    className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                  <a
                    href="/home/business"
                    className="block py-3 px-4 text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (typeof onBecomeVendor === "function") onBecomeVendor();
                    }}
                  >
                    Become a vendor
                  </a>
                </>
              )}
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    navigateToLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-6 px-4 py-3 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors duration-200"
                >
                  Sign In
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-6 px-4 py-3 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar1;