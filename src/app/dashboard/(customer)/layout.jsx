"use client";

import Sidebar from "@/components/dashboard/customer/Sidebar";
import { RequireAuth } from "@/hooks/customer/auth/useRequireAuth"; 
export default function DashboardLayout({ children }) {
  return (
    <RequireAuth>
      <div className="min-h-screen flex bg-[#FAF8F6]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
