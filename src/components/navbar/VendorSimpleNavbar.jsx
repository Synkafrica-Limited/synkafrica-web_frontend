"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Buttons from "@/components/ui/Buttons";
import authService from "@/services/authService";

// Minimal navbar for vendor landing: logo icon on the left, Get started on the right
export default function VendorSimpleNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = authService.getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70 border-b border-gray-100">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" aria-label="Synkafrica home" className="flex items-center">
          <Image
            src="/images/brand/synkafrica-logo-single.png"
            alt="Synkafrica"
            width={40}
            height={40}
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link href="/dashboard/business/home">
              <Buttons variant="filled" size="sm" className="text-md rounded-full px-8">Go to Dashboard</Buttons>
            </Link>
          ) : (
            <>
              <Link href="/business/login">
                <Buttons variant="outline" size="sm" className="text-md rounded-full px-6">Log in</Buttons>
              </Link>
              <Link href="/business/signup">
                <Buttons variant="filled" size="sm" className="text-md rounded-full px-8">Get started</Buttons>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
