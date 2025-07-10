import { FaPlaneDeparture } from "react-icons/fa";

export default function FlightsComingSoonTab() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[220px] bg-white rounded-2xl shadow border border-gray-100">
      <FaPlaneDeparture className="text-4xl text-gray-400 mb-3" />
      <div className="text-xl font-semibold text-gray-700 mb-1">Flights</div>
      <div className="text-base text-gray-500">Coming soon</div>
    </div>
  );
}