"use client";

import BusinessSidebar from "@/components/dashboard/vendor/BusinessSidebar";
import RequireAuth from "@/components/auth/business/RequireAuth";
import { useSession } from "@/hooks/business/useSession";
import { DashboardLoadingScreen } from "@/components/ui/LoadingScreen";
import { BusinessProvider } from '@/context/BusinessContext';
import { VendorNotificationProvider } from '@/context/VendorNotificationContext';
import VendorSocketProvider from '@/components/vendor/VendorSocketProvider';

export default function BusinessDashboardLayout({ children }) {
  const { loading, isLoggedIn } = useSession();

  // While validating session, render a modern loading screen
  if (loading) {
    return <DashboardLoadingScreen message="Loading Dashboard..." />;
  }

  return (
    <RequireAuth>
      <BusinessProvider>
        <VendorNotificationProvider>
          <VendorSocketProvider>
            <div className="flex h-screen overflow-hidden bg-[#FAF8F6]">
              {/* Sidebar */}
              <BusinessSidebar />

              {/* Main Content */}
              <main className="flex-1 overflow-y-auto flex flex-col lg:pt-0">
                {/* Page Content */}
                <div className="flex-1">{children}</div>
              </main>
            </div>
          </VendorSocketProvider>
        </VendorNotificationProvider>
      </BusinessProvider>
    </RequireAuth>
  );
}
