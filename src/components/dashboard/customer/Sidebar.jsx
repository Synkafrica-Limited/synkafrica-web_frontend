// src/components/dashboard/Sidebar.jsx
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  IoPersonOutline,
  IoLogOutOutline,
  IoDocumentTextOutline,
  IoChatbubbleEllipsesOutline,
  IoCloseOutline,
  IoMenu,
  IoHomeOutline,
  IoCardOutline,
} from "react-icons/io5"
import { useUserProfile } from "@/hooks/customer/details/useUserProfileDetails"
import { useSignOut } from "@/hooks/customer/auth/useSignout"

const menuItems = [
  { 
    label: "Overview", 
    icon: <IoHomeOutline className="w-5 h-5" />, 
    href: "/dashboard" 
  },
  { 
    label: "My Profile", 
    icon: <IoPersonOutline className="w-5 h-5" />, 
    href: "/dashboard/profile" 
  },
  { 
    label: "Bookings",   
    icon: <IoDocumentTextOutline className="w-5 h-5" />, 
    href: "/dashboard/bookings" 
  },
  { 
    label: "Feedback",    
    icon: <IoChatbubbleEllipsesOutline className="w-5 h-5" />, 
    href: "/dashboard/feedback" 
  },
  { 
    label: "Transactions",    
    icon: <IoCardOutline className="w-5 h-5" />, 
    href: "/dashboard/transactions" 
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Use the user profile hook
  const { 
    userProfile, 
    loading: profileLoading, 
    error: profileError, 
    fetchUserProfile 
  } = useUserProfile()

  // Use the signout hook
  const { signOut, loading: signOutLoading, error: signOutError } = useSignOut()

  // Fetch profile on component mount
  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  // Prevent background scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileOpen])

  const closeMobile = () => setIsMobileOpen(false)

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile) return "U"
    const first = userProfile.firstName?.[0] || ""
    const last = userProfile.lastName?.[0] || ""
    return `${first}${last}`.toUpperCase() || "U"
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!userProfile) return "Customer"
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`
    }
    return userProfile.firstName || userProfile.email?.split('@')[0] || "Customer"
  }

  const handleSignOut = () => {
    signOut()
    closeMobile()
  }

  // Filter out 401 errors since they're expected during logout
  const shouldShowSignOutError = signOutError && !signOutError.includes('401')

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <IoMenu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen
          bg-white border-r border-gray-200 
          transition-all duration-300 flex flex-col
          w-64 z-50
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={closeMobile}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <IoCloseOutline className="w-5 h-5 text-gray-600" />
        </button>

        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link
            href="/dashboard/"
            className="flex items-center gap-3"
            onClick={closeMobile}
          >
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/images/brand/synkafrica-logo-single.png"
                alt="Synkkafrica Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Synkkafrica</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              // Special handling for the dashboard root to avoid highlighting it for sub-routes
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 group ${
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className={`shrink-0 ${
                      isActive
                        ? "text-primary-600"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}>
                      {item.icon}
                    </span>
                    <span className={`font-medium text-sm ${
                      isActive ? "text-primary-600" : "text-gray-700"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Greeting Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              {profileLoading ? (
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <span className="text-sm font-semibold text-gray-700">
                  {getUserInitials()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {profileLoading ? (
                <div className="space-y-1">
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500">Welcome back,</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getUserDisplayName()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            disabled={signOutLoading}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors w-full group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoLogOutOutline className="w-5 h-5 shrink-0 text-gray-500 group-hover:text-red-600" />
            <span className="font-medium text-sm">
              {signOutLoading ? "Signing out..." : "Sign out"}
            </span>
          </button>
          {/* Only show non-401 errors */}
          {shouldShowSignOutError && (
            <p className="text-red-500 text-xs mt-2 text-center">{signOutError}</p>
          )}
        </div>
      </aside>
    </>
  )
}