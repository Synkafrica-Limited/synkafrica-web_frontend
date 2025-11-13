"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ onSelect }) {
  const [position, setPosition] = useState([9.05785, 7.49508]); // Default: Abuja
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect && onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} />;
}

export default function AddBusinessLocation({ value, onSave, onCancel }) {
  const [step, setStep] = useState(1);
  const [marker, setMarker] = useState(value?.latlng || [9.05785, 7.49508]);
  const [address, setAddress] = useState({
    country: value?.country || "Nigeria",
    street: value?.street || "",
    city: value?.city || "",
    state: value?.state || "",
    postal: value?.postal || "",
  });

  // Simulate reverse geocoding (in real app, use an API)
  const handleMapSelect = (latlng) => {
    setMarker(latlng);
    // Optionally, call a geocoding API here to fill address fields
    setStep(2);
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center">
        {step === 1 && (
          <>
            <h3 className="text-2xl font-bold mb-8 text-center">
              Where is your business located?
            </h3>
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-80 rounded-xl overflow-hidden mb-6">
                <MapContainer
                  center={marker}
                  zoom={12}
                  style={{ width: "100%", height: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onSelect={handleMapSelect} />
                </MapContainer>
              </div>
              <div className="w-full flex justify-between mt-4">
                <button
                  className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-8 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#E26A3D] text-white rounded-md px-8 py-2 font-medium hover:bg-[#c2552e] transition"
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="text-2xl font-bold mb-2 text-center">
              Confirm your address
            </h3>
            <p className="text-gray-500 text-center mb-6 text-sm">
              Your address is shared with guest when making reservations
            </p>
            <form className="w-full max-w-lg mx-auto">
              <select
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                className="w-full border rounded-md px-4 py-3 mb-3 text-base"
              >
                <option value="Nigeria">Nigeria</option>
                {/* Add more countries as needed */}
              </select>
              <input
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                className="w-full border rounded-md px-4 py-3 mb-3 text-base"
                placeholder="Street address"
              />
              <input
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full border rounded-md px-4 py-3 mb-3 text-base"
                placeholder="City/town/village"
              />
              <input
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                className="w-full border rounded-md px-4 py-3 mb-3 text-base"
                placeholder="Province/state"
              />
              <input
                name="postal"
                value={address.postal}
                onChange={handleAddressChange}
                className="w-full border rounded-md px-4 py-3 mb-6 text-base"
                placeholder="Postal code (if applicable)"
              />
            </form>
            <div className="flex w-full justify-between mt-4">
              <button
                className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-8 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="bg-[#E26A3D] text-white rounded-md px-8 py-2 font-medium hover:bg-[#c2552e] transition"
                onClick={() => onSave({ ...address, latlng: marker })}
                disabled={!address.street || !address.city || !address.state}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}