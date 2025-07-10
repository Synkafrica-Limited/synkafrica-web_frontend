"use client";
import { useState } from "react";
import AddBusinessName from "./AddBusinessName";
import AddBusinessLocation from "./AddBusinessLocation";
import ConfirmBusinessAddress from "./ConfirmBusinessAddress";

export default function ShareQualificationsStep() {
  const [show, setShow] = useState(null); // "name" | "location" | "address" | null
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState(null); // { lat, lng, address }
  const [address, setAddress] = useState({
    country: "",
    street: "",
    city: "",
    state: "",
    postal: "",
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-gray-400 text-base mb-2 mt-4">Step 3</div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Share your qualifications</h2>
        <p className="text-gray-500 mb-6">Help customers to know you</p>

        {/* Accordion-style cards */}
        <div className="flex flex-col gap-4">
          {/* Business Name */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer" onClick={() => setShow("name")}>
            <div>
              <div className="font-semibold">Add your business name</div>
              {businessName && <div className="text-gray-500 text-sm mt-1">{businessName}</div>}
            </div>
            <span className="text-2xl text-primary-500 font-bold">+</span>
          </div>
          {/* Modal/Form */}
          {show === "name" && (
            <AddBusinessName
              value={businessName}
              onSave={(val) => {
                setBusinessName(val);
                setShow(null);
              }}
              onCancel={() => setShow(null)}
            />
          )}

          {/* Business Location */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer" onClick={() => setShow("location")}>
            <div>
              <div className="font-semibold">Add your business location</div>
              {location?.address && <div className="text-gray-500 text-sm mt-1">{location.address}</div>}
            </div>
            <span className="text-2xl text-primary-500 font-bold">+</span>
          </div>
          {show === "location" && (
            <AddBusinessLocation
              value={location}
              onSave={(loc) => {
                setLocation(loc);
                setShow(null);
              }}
              onCancel={() => setShow(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}