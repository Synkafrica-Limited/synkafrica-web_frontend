"use client";

import BusinessSidebar from "@/components/dashboard/vendor/BusinessSidebar";
import BusinessDashboardHeader from "@/components/dashboard/vendor/BusinessDashboardHeader";
import RequireAuth from "@/components/auth/business/RequireAuth";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/business/useSession";
import Spinner from "@/components/ui/Spinner";

export default function BusinessDashboardLayout({ children }) {
  const pathname = usePathname();
  const { loading, isLoggedIn } = useSession();

  // Page title logic
  const getPageTitle = () => {
    if (pathname.includes("/profile")) return "My Profile";
    if (pathname.includes("/listings")) return "Listings";
    if (pathname.includes("/orders")) return "Orders";
    if (pathname.includes("/transaction")) return "Transactions";
    if (pathname.includes("/dispute")) return "Dispute";
    return "Dashboard";
  };

  // While validating session, render a centered loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF8F6]">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="flex h-screen overflow-hidden bg-[#FAF8F6]">
        {/* Sidebar */}
        <BusinessSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Header now uses session + profile data */}
          <BusinessDashboardHeader title={getPageTitle()} />

          {/* Page Content */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </RequireAuth>
  );
}
