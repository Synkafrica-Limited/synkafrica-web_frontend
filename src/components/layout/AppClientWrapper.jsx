"use client";
import { useState } from "react";
import ListingSelection from "@/components/dashboard/vendor/ListingSelection";
import Navbar1 from "@/components/navbar/Navbar1";

export default function AppClientWrapper({ children }) {
  const [showListingSelection, setShowListingSelection] = useState(false);

  return (
    <>
      <Navbar1 onBecomeVendor={() => setShowListingSelection(true)} />
      {showListingSelection && (
        <ListingSelection onClose={() => setShowListingSelection(false)} />
      )}
      {children}
    </>
  );
}