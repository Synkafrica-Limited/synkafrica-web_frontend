"use client";

import BusinessSidebar from "@/components/dashboard/vendor/BusinessSidebar";
import RequireAuth from "@/components/auth/business/RequireAuth";
import { useSession } from "@/hooks/business/useSession";
import { DashboardLoadingScreen } from "@/components/ui/LoadingScreen";
import { BusinessProvider } from "@/context/BusinessContext";
import { ToastProvider } from "@/components/ui/ToastProvider"; 

export default function BusinessDashboardLayout({ children }) {
  const { loading, isLoggedIn } = useSession();

  if (loading) {
    return <DashboardLoadingScreen message="Loading Dashboard..." />;
  }

  return (
    <ToastProvider>  
      <RequireAuth>
        <BusinessProvider>
          <div className="flex h-screen overflow-hidden bg-[#FAF8F6]">
            <BusinessSidebar />

            <main className="flex-1 overflow-y-auto flex flex-col">
              <div className="flex-1">{children}</div>
            </main>
          </div>
        </BusinessProvider>
      </RequireAuth>
    </ToastProvider>
  );
}
