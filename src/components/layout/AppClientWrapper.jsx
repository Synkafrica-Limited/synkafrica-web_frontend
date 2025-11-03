"use client";
import { useState } from "react";
// import ListingSelection from "@/app/business/onboarding/components/step1/ListingSelection";
import Navbar1 from "@/components/navbar/Navbar1";

export default function AppClientWrapper({ children }) {
  const [showSignupComponent, setSignupComponent] = useState(false);

  return (
    <>
      <Navbar1 onBecomeVendor={() => setSignupComponent(true)} />
      {/* {showListingSelection && (<ListingSelection onClose={() => setShowListingSelection(false)} />)} */}
      {children}
    </>
  );  
}
