"use client";

import BusinessSidebar from "@/components/dashboard/vendor/BusinessSidebar";
import BusinessDashboardHeader from "@/components/dashboard/vendor/BusinessDashboardHeader";
import { usePathname } from "next/navigation";

export default function BusinessDashboardLayout({ children }) {
  const pathname = usePathname();
  
  // Get page title based on route
  const getPageTitle = () => {
    if (pathname.includes('/profile')) return 'My Profile';
    if (pathname.includes('/listings')) return 'Listings';
    if (pathname.includes('/orders')) return 'Orders';
    if (pathname.includes('/transaction')) return 'Transactions';
    if (pathname.includes('/dispute')) return 'Dispute';
    return 'Dashboard';
  };

  // Mock user data - replace with actual user data from context/auth
  const user = {
    name: "Synkkafrica",
    email: "eodeyale@synkkafrica.com",
    profileImage: null, // or URL to profile image
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF8F6]">
      {/* Sidebar */}
      <BusinessSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <BusinessDashboardHeader title={getPageTitle()} user={user} />
        
        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
