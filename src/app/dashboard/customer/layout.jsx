"use client";

import Sidebar from "@/components/dashboard/customer/Sidebar";

export default function DashboardLayout({ children }) {
  // You could even derive “active” from usePathname() from next/navigation
  return (
    <div className="min-h-screen flex bg-[#FAF8F6]">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col gap-6 py-8 px-4 sm:px-6 md:px-10 lg:px-16">
        {children}
      </main>
    </div>
  );
}
