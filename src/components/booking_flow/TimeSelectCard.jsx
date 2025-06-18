import React, { useState } from "react";

export default function TimeSelectCard({
  pickupTime,
  dropoffTime,
  onPickupSelect,
  onDropoffSelect,
  onDone,
  onClose,
  times = [
    "01:00pm", "02:00pm", "03:00pm", "04:00pm", "05:00pm",
    "06:00pm", "07:00pm", "08:00am", "09:00am", "10:00am"
  ],
  labels = { pickup: "Pick up time", dropoff: "Drop off time" }, // <-- Add this prop for custom labels
}) {
  const [activeTab, setActiveTab] = useState("pickup");

  return (
    <div className="absolute left-0 top-[52px] w-[95vw] max-w-md sm:w-[400px] bg-white border border-gray-200 rounded-xl shadow-2xl z-20 p-4 sm:p-6">
      {/* Tabs */}
      <div className="flex mb-4 gap-2">
        <button
          className={`flex-1 px-2 py-2 rounded-md font-medium text-base flex flex-col items-center border-2 ${
            activeTab === "pickup"
              ? "border-primary-200 bg-gray-100 text-gray-900"
              : "border-transparent bg-gray-100 text-gray-400"
          }`}
          onClick={() => setActiveTab("pickup")}
          type="button"
        >
          <span>{labels.pickup}</span>
          <span className="text-sm font-normal mt-1">{pickupTime || <span className="opacity-40">--:--</span>}</span>
        </button>
        <button
          className={`flex-1 px-2 py-2 rounded-md font-medium text-base flex flex-col items-center border-2 ${
            activeTab === "dropoff"
              ? "border-primary-200 bg-gray-100 text-gray-900"
              : "border-transparent bg-gray-100 text-gray-400"
          }`}
          onClick={() => setActiveTab("dropoff")}
          type="button"
        >
          <span>{labels.dropoff}</span>
          <span className="text-sm font-normal mt-1">{dropoffTime || <span className="opacity-40">--:--</span>}</span>
        </button>
      </div>
      {/* Time List */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {/* Pick up times */}
        <div className={`flex-1 ${activeTab === "dropoff" ? "hidden sm:block" : ""}`}>
          {times.map((t) => (
            <div
              key={"pickup-" + t}
              className={`py-2 px-2 rounded cursor-pointer text-base text-center transition ${
                pickupTime === t
                  ? "bg-primary-100 text-primary-500 font-semibold"
                  : "text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => {
                if (activeTab === "pickup" || window.innerWidth >= 640) onPickupSelect(t);
              }}
            >
              {t}
            </div>
          ))}
        </div>
        {/* Drop off times */}
        <div className={`flex-1 ${activeTab === "pickup" ? "hidden sm:block" : ""}`}>
          {times.map((t) => (
            <div
              key={"dropoff-" + t}
              className={`py-2 px-2 rounded cursor-pointer text-base text-center transition ${
                dropoffTime === t
                  ? "bg-primary-100 text-primary-500 font-semibold"
                  : "text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => {
                if (activeTab === "dropoff" || window.innerWidth >= 640) onDropoffSelect(t);
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
      {/* Done Button */}
      <div className="flex justify-end mt-6">
        <button
          className={`bg-primary-500 text-white px-8 py-2 rounded-md font-medium text-base transition ${
            pickupTime && dropoffTime ? "" : "opacity-60 cursor-not-allowed"
          }`}
          disabled={!(pickupTime && dropoffTime)}
          onClick={onDone}
        >
          Done
        </button>
      </div>
    </div>
  );
}