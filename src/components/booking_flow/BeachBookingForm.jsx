'use client'

import { useState, useRef } from 'react'
import { IoLocationOutline, IoCalendarOutline } from 'react-icons/io5';
import Buttons from '@/components/ui/Buttons';
import CalendarCard from './CalendarCard';
import PopularDestinationsCard from './PopularDestinationsCard';
import { GuestSelectorDropdown } from './GuestSelectorDropdown';

// helper
const formatDate = d =>
  d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric' }) : '--'

export default function BeachBookingForm({
  popularDestinations = [],
  onSearch = () => { }
}) {
  // all the local state
  const [pickup, setPickup] = useState('')
  const [pickupSub, setPickupSub] = useState('')
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [pickupFocused, setPickupFocused] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const pickupRef = useRef(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
      {/* Beach location input */}
      <div className="relative">
        <label className="sr-only">Pick-up</label>
        <div
          ref={pickupRef}
          tabIndex={0}
          className={`flex items-center border rounded-md px-3 py-2 h-[55px] bg-white cursor-pointer transition
            ${pickupFocused
              ? 'border-blue-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]'
              : 'border-gray-300'
            }`}
          onClick={() => {
            setPickupFocused(true)
            setDropoffFocused(false)
          }}
        >
          <IoLocationOutline className="text-gray-400 mr-2" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-xs text-gray-500">Going to?</span>
            <span className="text-sm text-gray-900 truncate">
              {pickup || <span className="text-gray-400">Select location</span>}
            </span>
            {pickupSub && (
              <span className="text-xs text-gray-400 truncate">
                {pickupSub}
              </span>
            )}
          </div>
        </div>
        {pickupFocused && (
          <PopularDestinationsCard
            destinations={popularDestinations}
            onSelect={dest => {
              setPickup(dest.city)
              setPickupSub(dest.airport)
              setPickupFocused(false)
            }}
          />
        )}
      </div>

      {/* Date */}
      <div className="relative">
        <label className="sr-only">Date</label>
        <button
          type="button"
          className="w-full flex flex-col items-start justify-center border border-gray-300 rounded-md px-3 py-2 bg-white text-left h-[55px]"
          onClick={() => setCalendarOpen(true)}
        >
          <div className="flex items-center">
            <IoCalendarOutline className="text-gray-700 mr-2 text-xl" />
            <div>
              <div className="text-xs text-gray-700">Date</div>
              <div className="text-sm font-medium text-gray-900">
                {dateRange.start ? formatDate(dateRange.start) : 'Select'}
                {dateRange.end ? ` - ${formatDate(dateRange.end)}` : ''}
              </div>
            </div>
          </div>
        </button>
        {calendarOpen && (
          <CalendarCard
            mode="single" // <-- Add this line for single date selection
            start={dateRange.start}
            onChange={({ date }) => {
              setDateRange({ start: date, end: null });
            }}
            onClose={() => setCalendarOpen(false)}
          />
        )}
      </div>
      {/* Guests */}
      <div>
        <GuestSelectorDropdown
          adults={adults}
          children={children}
          setAdults={setAdults}
          setChildren={setChildren}
        />
      </div>
      {/* Search */}
      <div>
        <Buttons
          variant="filled"
          size="md"
          className="w-full h-[55px] flex items-center justify-center"
          onClick={() =>
            onSearch({
              pickup, pickupSub,
              dropoff, dropoffSub,
              dateRange,
              pickupTime, dropoffTime,
              guests: adults + children,
              children,
              adults,
            })
          }
        >
          Search <span className="ml-2">→</span>
        </Buttons>
      </div>
    </div>
  );
}
