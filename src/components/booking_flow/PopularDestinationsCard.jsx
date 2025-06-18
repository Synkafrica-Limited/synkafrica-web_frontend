import { IoLocationOutline } from 'react-icons/io5'

export default function PopularDestinationsCard({
  title = "Coming from?",
  subtitle = "Popular destinations",
  destinations = [],
  onSelect,
}) {
  return (
    <div className="absolute left-0 top-[52px] w-[90vw] max-w-md bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4 sm:w-md">
      <div className="text-gray-400 font-medium mb-2">{title}</div>
      <div className="font-semibold text-gray-800 mb-2">{subtitle}</div>
      <ul className="space-y-1">
        {destinations.map((dest, idx) => (
          <li
            key={idx}
            className="flex items-center text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
            onClick={() => onSelect?.(dest)}
          >
            <IoLocationOutline className="mr-2 text-primary-500" />
            {dest.city}
            <span className="ml-2 text-gray-400">{dest.location}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}