"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  ShoppingCart,
  CreditCard,
  AlertCircle,
  LogOut,
  X,
  Menu,
  User,
  Bell,
  Settings,
  MessageSquare,
} from "lucide-react";

import { useSignOut } from "@/hooks/business/useSignOut";
import { useUserProfile } from "@/hooks/business/useUserProfileVendor";
import authService from '@/services/authService';

/**
 * Business Dashboard Sidebar Component
 * Navigation sidebar for vendor/business dashboard
 */
export default function BusinessSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [token, setToken] = useState(null);

  // Load token after client mount
  useEffect(() => {
    const t = authService.getAccessToken();
    setToken(t);
  }, []);

  // Only use hook if token exists
  const { user, loading: userLoading } = useUserProfile(token);

  const { signOut, loading } = useSignOut();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/business/home",
      active: pathname === "/dashboard/business/home",
    },
    {
      label: "My Profile",
      icon: User,
      href: "/dashboard/business/profile",
      active: pathname.startsWith("/dashboard/business/profile"),
    },
    {
      label: "Listings",
      icon: List,
      href: "/dashboard/business/listings",
      active: pathname.startsWith("/dashboard/business/listings"),
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/dashboard/business/orders",
      active: pathname.startsWith("/dashboard/business/orders"),
    },
    {
      label: "Transaction",
      icon: CreditCard,
      href: "/dashboard/business/transaction",
      active: pathname.startsWith("/dashboard/business/transaction"),
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/dashboard/business/notifications",
      active: pathname.startsWith("/dashboard/business/notifications"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/business/settings",
      active: pathname.startsWith("/dashboard/business/settings"),
    },
    {
      label: "Support",
      icon: MessageSquare,
      href: "/dashboard/business/support",
      active: pathname.startsWith("/dashboard/business/support"),
    },
  ];

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-600" />
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
          ${isMobileOpen
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
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link
            href="/dashboard/business/home"
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
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${item.active
                      ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${item.active
                        ? "text-primary-600"
                        : "text-gray-500 group-hover:text-gray-900"
                        }`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Greeting Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
              {userLoading ? (
                <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
              ) : user?.firstName ? (
                <span className="text-sm font-semibold text-primary-700">
                  {user.firstName[0]}{user.lastName?.[0] || ""}
                </span>
              ) : (
                <span className="text-sm font-semibold text-primary-700">SA</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {userLoading ? (
                <div className="space-y-1">
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500">Welcome back,</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={signOut}
            disabled={loading}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors w-full group"
          >
            <LogOut className="w-5 h-5 shrink-0 text-gray-500 group-hover:text-red-600" />
            <span className="font-medium text-sm">
              {loading ? "Logging out..." : "Log out"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
